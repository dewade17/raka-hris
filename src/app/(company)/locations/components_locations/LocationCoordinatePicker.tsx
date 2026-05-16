'use client';

import { App, Button, Space, Tooltip, Typography, theme } from 'antd';
import { Crosshair, LocateFixed, Minus, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationCoordinatePickerProps = {
  latitude: number | null;
  longitude: number | null;
  disabled?: boolean;
  onChange: (coordinates: Coordinates) => void;
};

type MapSize = {
  width: number;
  height: number;
};

type MapTile = {
  key: string;
  url: string;
  left: number;
  top: number;
};

type MapView = {
  topLeftPixelX: number;
  topLeftPixelY: number;
  centerPixelX: number;
  tiles: MapTile[];
};

type DragState = {
  pointerId: number;
  lastX: number;
  lastY: number;
  totalDistance: number;
};

type MapCamera = {
  center: Coordinates;
  selectedKey: string;
};

const TILE_SIZE = 256;
const MIN_ZOOM = 2;
const MAX_ZOOM = 19;
const DEFAULT_ZOOM = 16;
const CLICK_DISTANCE_THRESHOLD = 5;
const DEFAULT_CENTER: Coordinates = {
  latitude: -8.65,
  longitude: 115.216667,
};
const MAX_MERCATOR_LATITUDE = 85.05112878;

export function LocationCoordinatePicker({ latitude, longitude, disabled = false, onChange }: LocationCoordinatePickerProps) {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const mapRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const selectedCoordinates = useMemo(() => normalizeSelectedCoordinates(latitude, longitude), [latitude, longitude]);
  const selectedKey = selectedCoordinates ? `${selectedCoordinates.latitude}:${selectedCoordinates.longitude}` : 'empty';
  const [mapSize, setMapSize] = useState<MapSize>({ width: 0, height: 260 });
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [camera, setCamera] = useState<MapCamera>(() => ({
    center: selectedCoordinates ?? DEFAULT_CENTER,
    selectedKey,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const center = camera.selectedKey === selectedKey ? camera.center : selectedCoordinates ?? DEFAULT_CENTER;
  const mapView = useMemo(() => buildMapView(center, zoom, mapSize), [center, mapSize, zoom]);
  const selectedPoint = useMemo(() => {
    if (!selectedCoordinates || mapSize.width <= 0 || mapSize.height <= 0) {
      return null;
    }

    const projected = projectCoordinates(selectedCoordinates, zoom);
    const worldPixelWidth = TILE_SIZE * 2 ** zoom;
    const wrappedX = projected.x + Math.round((mapView.centerPixelX - projected.x) / worldPixelWidth) * worldPixelWidth;

    return {
      x: wrappedX - mapView.topLeftPixelX,
      y: projected.y - mapView.topLeftPixelY,
    };
  }, [mapSize.height, mapSize.width, mapView.centerPixelX, mapView.topLeftPixelX, mapView.topLeftPixelY, selectedCoordinates, zoom]);

  const measureMap = useCallback(() => {
    const element = mapRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    setMapSize({
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    });
  }, []);

  useEffect(() => {
    measureMap();

    const element = mapRef.current;

    if (!element) {
      return undefined;
    }

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measureMap);

      return () => window.removeEventListener('resize', measureMap);
    }

    const observer = new ResizeObserver(measureMap);
    observer.observe(element);

    return () => observer.disconnect();
  }, [measureMap]);

  const setMapCenter = useCallback(
    (updater: Coordinates | ((currentCenter: Coordinates) => Coordinates)) => {
      setCamera((currentCamera) => {
        const currentCenter = currentCamera.selectedKey === selectedKey ? currentCamera.center : selectedCoordinates ?? DEFAULT_CENTER;
        const nextCenter = typeof updater === 'function' ? updater(currentCenter) : updater;

        return {
          center: nextCenter,
          selectedKey,
        };
      });
    },
    [selectedCoordinates, selectedKey],
  );

  const applyCoordinates = useCallback(
    (coordinates: Coordinates) => {
      const roundedCoordinates = {
        latitude: roundCoordinate(coordinates.latitude),
        longitude: roundCoordinate(coordinates.longitude),
      };

      setMapCenter(roundedCoordinates);
      onChange(roundedCoordinates);
    },
    [onChange, setMapCenter],
  );

  const coordinatesFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const element = mapRef.current;

      if (!element || mapSize.width <= 0 || mapSize.height <= 0) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      const pixelX = mapView.topLeftPixelX + event.clientX - rect.left;
      const pixelY = mapView.topLeftPixelY + event.clientY - rect.top;

      return coordinatesFromPixels(pixelX, pixelY, zoom);
    },
    [mapSize.height, mapSize.width, mapView.topLeftPixelX, mapView.topLeftPixelY, zoom],
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      totalDistance: 0,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;

    if (disabled || !dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.lastX;
    const deltaY = event.clientY - dragState.lastY;

    if (deltaX === 0 && deltaY === 0) {
      return;
    }

    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    dragState.totalDistance += Math.hypot(deltaX, deltaY);

    setMapCenter((currentCenter) => panCenterByPixels(currentCenter, zoom, deltaX, deltaY));
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current = null;
    setIsDragging(false);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // The pointer may already be released by the browser after cancellation.
    }

    if (disabled || dragState.totalDistance > CLICK_DISTANCE_THRESHOLD) {
      return;
    }

    const nextCoordinates = coordinatesFromPointer(event);

    if (nextCoordinates) {
      applyCoordinates(nextCoordinates);
    }
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current = null;
    setIsDragging(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    const panDistance = 80;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      applyCoordinates(center);
      return;
    }

    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      setZoom((currentZoom) => Math.min(MAX_ZOOM, currentZoom + 1));
      return;
    }

    if (event.key === '-' || event.key === '_') {
      event.preventDefault();
      setZoom((currentZoom) => Math.max(MIN_ZOOM, currentZoom - 1));
      return;
    }

    const panByKey: Record<string, { deltaX: number; deltaY: number }> = {
      ArrowUp: { deltaX: 0, deltaY: panDistance },
      ArrowDown: { deltaX: 0, deltaY: -panDistance },
      ArrowLeft: { deltaX: panDistance, deltaY: 0 },
      ArrowRight: { deltaX: -panDistance, deltaY: 0 },
    };
    const delta = panByKey[event.key];

    if (delta) {
      event.preventDefault();
      setMapCenter((currentCenter) => panCenterByPixels(currentCenter, zoom, delta.deltaX, delta.deltaY));
    }
  };

  const handleUseCurrentLocation = () => {
    if (disabled || isLocating) {
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      message.warning('Your browser does not support current location access.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentCoordinates = {
          latitude: clamp(position.coords.latitude, -90, 90),
          longitude: normalizeLongitude(position.coords.longitude),
        };

        applyCoordinates(currentCoordinates);
        message.success('Current location applied.');
        setIsLocating(false);
      },
      () => {
        message.error('Current location could not be detected. Please allow location access and try again.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000,
      },
    );
  };

  return (
    <div
      style={{
        overflow: 'hidden',
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        background: token.colorBgLayout,
      }}
    >
      <div
        ref={mapRef}
        style={{
          position: 'relative',
          height: 260,
          overflow: 'hidden',
          background: token.colorBgLayout,
        }}
      >
        <div
          role='region'
          aria-label='Location coordinate map picker'
          tabIndex={disabled ? -1 : 0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerCancel}
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'crosshair',
            outline: 'none',
            touchAction: 'none',
          }}
        >
          {mapView.tiles.map((tile) => (
            // eslint-disable-next-line @next/next/no-img-element -- OpenStreetMap tiles are remote map rasters, not app-owned images.
            <img
              key={tile.key}
              src={tile.url}
              alt=''
              aria-hidden='true'
              draggable={false}
              style={{
                position: 'absolute',
                left: tile.left,
                top: tile.top,
                width: TILE_SIZE,
                height: TILE_SIZE,
                userSelect: 'none',
              }}
            />
          ))}

          {selectedPoint ? (
            <span
              aria-hidden='true'
              style={{
                position: 'absolute',
                left: selectedPoint.x,
                top: selectedPoint.y,
                zIndex: 2,
                display: 'inline-flex',
                width: 34,
                height: 34,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50% 50% 50% 0',
                background: token.colorError,
                color: token.colorWhite,
                boxShadow: token.boxShadowSecondary,
                transform: 'translate(-50%, -100%) rotate(-45deg)',
              }}
            >
              <Crosshair
                size={17}
                style={{ transform: 'rotate(45deg)' }}
              />
            </span>
          ) : null}
        </div>

        <Space
          direction='vertical'
          size={6}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 3,
          }}
        >
          <Tooltip title='Zoom in'>
            <Button
              size='small'
              disabled={disabled || zoom >= MAX_ZOOM}
              aria-label='Zoom in'
              icon={
                <Plus
                  size={14}
                  aria-hidden='true'
                  focusable='false'
                />
              }
              onClick={() => setZoom((currentZoom) => Math.min(MAX_ZOOM, currentZoom + 1))}
            />
          </Tooltip>
          <Tooltip title='Zoom out'>
            <Button
              size='small'
              disabled={disabled || zoom <= MIN_ZOOM}
              aria-label='Zoom out'
              icon={
                <Minus
                  size={14}
                  aria-hidden='true'
                  focusable='false'
                />
              }
              onClick={() => setZoom((currentZoom) => Math.max(MIN_ZOOM, currentZoom - 1))}
            />
          </Tooltip>
          <Tooltip title='Recenter selected point'>
            <Button
              size='small'
              disabled={disabled || !selectedCoordinates}
              aria-label='Recenter selected point'
              icon={
                <Crosshair
                  size={14}
                  aria-hidden='true'
                  focusable='false'
                />
              }
              onClick={() => {
                if (selectedCoordinates) {
                  setMapCenter(selectedCoordinates);
                }
              }}
            />
          </Tooltip>
        </Space>

        <Tooltip title='Use current location'>
          <Button
            size='small'
            loading={isLocating}
            disabled={disabled}
            icon={
              <LocateFixed
                size={14}
                aria-hidden='true'
                focusable='false'
              />
            }
            onClick={handleUseCurrentLocation}
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 3,
              boxShadow: token.boxShadowTertiary,
            }}
          >
            Use current location
          </Button>
        </Tooltip>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 12,
          padding: '10px 12px',
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
        }}
      >
        <Typography.Link
          href='https://www.openstreetmap.org/copyright'
          target='_blank'
          rel='noreferrer'
          style={{ fontSize: 12 }}
        >
          &copy; OpenStreetMap contributors
        </Typography.Link>
      </div>
    </div>
  );
}

function normalizeSelectedCoordinates(latitude: number | null, longitude: number | null) {
  if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

function isValidLatitude(value: number | null): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value: number | null): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= -180 && value <= 180;
}

function buildMapView(center: Coordinates, zoom: number, size: MapSize): MapView {
  const centerPoint = projectCoordinates(center, zoom);
  const topLeftPixelX = centerPoint.x - size.width / 2;
  const topLeftPixelY = centerPoint.y - size.height / 2;

  if (size.width <= 0 || size.height <= 0) {
    return {
      topLeftPixelX,
      topLeftPixelY,
      centerPixelX: centerPoint.x,
      tiles: [],
    };
  }

  const worldTileCount = 2 ** zoom;
  const minTileX = Math.floor(topLeftPixelX / TILE_SIZE) - 1;
  const maxTileX = Math.floor((topLeftPixelX + size.width) / TILE_SIZE) + 1;
  const minTileY = Math.max(0, Math.floor(topLeftPixelY / TILE_SIZE) - 1);
  const maxTileY = Math.min(worldTileCount - 1, Math.floor((topLeftPixelY + size.height) / TILE_SIZE) + 1);
  const tiles: MapTile[] = [];

  for (let tileX = minTileX; tileX <= maxTileX; tileX += 1) {
    const wrappedTileX = wrapTileX(tileX, worldTileCount);

    for (let tileY = minTileY; tileY <= maxTileY; tileY += 1) {
      tiles.push({
        key: `${tileX}:${tileY}`,
        url: `https://tile.openstreetmap.org/${zoom}/${wrappedTileX}/${tileY}.png`,
        left: tileX * TILE_SIZE - topLeftPixelX,
        top: tileY * TILE_SIZE - topLeftPixelY,
      });
    }
  }

  return {
    topLeftPixelX,
    topLeftPixelY,
    centerPixelX: centerPoint.x,
    tiles,
  };
}

function projectCoordinates(coordinates: Coordinates, zoom: number) {
  return {
    x: longitudeToTileX(coordinates.longitude, zoom) * TILE_SIZE,
    y: latitudeToTileY(coordinates.latitude, zoom) * TILE_SIZE,
  };
}

function coordinatesFromPixels(pixelX: number, pixelY: number, zoom: number): Coordinates {
  return {
    latitude: tileYToLatitude(pixelY / TILE_SIZE, zoom),
    longitude: tileXToLongitude(pixelX / TILE_SIZE, zoom),
  };
}

function panCenterByPixels(center: Coordinates, zoom: number, deltaX: number, deltaY: number): Coordinates {
  const projectedCenter = projectCoordinates(center, zoom);

  return coordinatesFromPixels(projectedCenter.x - deltaX, projectedCenter.y - deltaY, zoom);
}

function longitudeToTileX(longitude: number, zoom: number) {
  return ((normalizeLongitude(longitude) + 180) / 360) * 2 ** zoom;
}

function latitudeToTileY(latitude: number, zoom: number) {
  const latitudeRadians = (clamp(latitude, -MAX_MERCATOR_LATITUDE, MAX_MERCATOR_LATITUDE) * Math.PI) / 180;

  return ((1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2) * 2 ** zoom;
}

function tileXToLongitude(tileX: number, zoom: number) {
  return normalizeLongitude((tileX / 2 ** zoom) * 360 - 180);
}

function tileYToLatitude(tileY: number, zoom: number) {
  const boundedTileY = clamp(tileY, 0, 2 ** zoom);
  const value = Math.PI - (2 * Math.PI * boundedTileY) / 2 ** zoom;

  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(value) - Math.exp(-value)));
}

function wrapTileX(tileX: number, worldTileCount: number) {
  return ((tileX % worldTileCount) + worldTileCount) % worldTileCount;
}

function normalizeLongitude(longitude: number) {
  return ((((longitude + 180) % 360) + 360) % 360) - 180;
}

function roundCoordinate(value: number) {
  return Number(value.toFixed(6));
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
