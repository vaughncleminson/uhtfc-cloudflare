'use client'
import { Marker } from '@/admin/types/marker'
import { Button, CheckboxInput, FieldLabel, Select, TextInput, useField } from '@payloadcms/ui'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { JSONFieldClientProps } from 'payload'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import './index.scss'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export function Map(props: JSONFieldClientProps) {
  const { value, setValue } = useField<string>({ path: props.path || props.field.name })
  const [settingsVisible, setSettingsVisible] = useState(false)

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [newMarkers, setNewMarkers] = useState<Marker[]>(() => {
    try {
      return value ? JSON.parse(value) : []
    } catch {
      return []
    }
  })
  const [newMarker, setNewMarker] = useState<Marker | null>(null)
  const [displayMarkers, setDisplayMarkers] = useState<mapboxgl.Marker[]>([])
  const [selectedId, setSelectedId] = useState<number>(0)
  const [method, setMethod] = useState<string>('create')

  useEffect(() => {
    mapboxgl.accessToken = mapboxgl.accessToken
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [29.493226, -29.78995],
      zoom: 12,
    })

    map.current.on('click', (e) => mapClickHandler(e))

    return () => {
      map.current!.remove()
    }
  }, [])

  useEffect(() => {
    console.log('Refresh Markers')
    console.log(newMarkers[0])
    if (newMarkers.length) {
      refreshMarkers(newMarkers)
    }
  }, [newMarkers])

  function refreshMarkers(markers: Marker[]) {
    removeAllMarkers()

    if (!Array.isArray(markers)) return

    const newDisplayMarkers: mapboxgl.Marker[] = []

    markers.forEach((marker) => {
      if (!Array.isArray(marker?.coords) || marker.coords.length < 2) return

      const myMarker = generateMarker(marker)

      const m = new mapboxgl.Marker(myMarker).setLngLat({
        lng: marker.coords[0],
        lat: marker.coords[1],
      })

      m.getElement().setAttribute('id', `${marker.id}`)
      m.getElement().addEventListener('click', (e) => markerClickHandler(e))

      m.addTo(map.current!)
      newDisplayMarkers.push(m)
    })

    // ✅ update state ONCE
    setDisplayMarkers(newDisplayMarkers)

    // ✅ calculate bounds from SAME markers
    const bounds = new mapboxgl.LngLatBounds()

    markers.forEach((marker) => {
      if (Array.isArray(marker?.coords) && marker.coords.length >= 2) {
        bounds.extend([marker.coords[0], marker.coords[1]])
      }
    })

    if (!bounds.isEmpty()) {
      map.current!.fitBounds(bounds, {
        duration: 0,
        padding: 50, // 500 is huge, can hide markers
        zoom: 11, // max zoom in
      })
    }
  }

  function generateMarker(marker: Marker): HTMLDivElement {
    const myMarker = document.createElement('div')

    let markerType = 'stillwater'
    let markerSize = '40px'
    switch (marker?.type) {
      case 'stillwater':
        markerType = 'stillwater'
        markerSize = '40px'
        break
      case 'river':
        markerType = 'river'
        markerSize = '40px'
        break
      case 'parking':
        markerType = 'parking'
        markerSize = '20px'
        break
      case 'no-entry':
        markerType = 'no-entry'
        markerSize = '20px'
        break
      case 'boundry':
        markerType = 'boundary'
        markerSize = '20px'
        break
      default:
        markerType = 'stillwater'
        markerSize = '40px'
    }
    myMarker.style.width = markerSize
    myMarker.style.height = markerSize
    myMarker.style.backgroundImage = `url(/assets/markers/${markerType}.png)`
    myMarker.style.backgroundSize = 'contain'
    myMarker.style.backgroundPosition = 'center'
    myMarker.style.backgroundRepeat = 'no-repeat'
    return myMarker
  }

  function mapClickHandler(e: any) {
    setMethod('create')
    setNewMarker({ coords: [e.lngLat.lng, e.lngLat.lat], id: displayMarkers.length })
    setSettingsVisible(true)
  }

  function markerClickHandler(event: any) {
    event.stopPropagation()
    setMethod('update')
    console.log(event)
    const targetElement = event.target as HTMLElement
    const markerId = targetElement.getAttribute('id')
    setSelectedId(parseInt(markerId!))
    const marker = newMarkers.find((m) => m.id === parseInt(markerId!))
    console.log('marker')
    console.log(marker)
    setNewMarker(marker!)
    setSettingsVisible(true)
  }

  function removeAllMarkers() {
    displayMarkers.forEach((m) => {
      m.getElement().removeEventListener('click', markerClickHandler)
      m.remove()
    })
    setDisplayMarkers([])
  }

  const locationBounds = (): mapboxgl.LngLatBounds => {
    const bounds = new mapboxgl.LngLatBounds()

    const markersArray = Array.isArray(newMarkers) ? newMarkers : newMarkers ? [newMarkers] : []

    markersArray.forEach((marker) => {
      const coords = marker?.coords

      // Case 1: [lng, lat]
      if (coords.length >= 2) {
        bounds.extend([coords[0], coords[1]])
      }
    })
    console.log('Calculated bounds:', bounds)

    return bounds
  }

  function add() {
    const markers = [...newMarkers]
    setNewMarkers([...markers, newMarker!])
    setValue(JSON.stringify([...markers, newMarker!]))
    setSettingsVisible(false)
  }
  function update() {
    const index = newMarkers?.findIndex((marker) => marker.id === selectedId)
    const markers = [...newMarkers]
    markers[index] = newMarker!
    setNewMarkers(markers)
    setValue(JSON.stringify(newMarkers))
    setSettingsVisible(false)
    refreshMarkers(newMarkers)
  }
  function remove() {
    const index = newMarkers?.findIndex((marker) => marker.id === selectedId)
    newMarkers?.splice(index, 1)
    setNewMarkers(newMarkers)
    setValue(JSON.stringify(newMarkers))
    setSettingsVisible(false)
    refreshMarkers(newMarkers)
  }

  return (
    <>
      <FieldLabel label="Map Markers" />
      <div id="map-container" ref={mapContainer}>
        {settingsVisible && (
          <div className="marker-settings">
            <div>
              <FieldLabel label="Latitude" />

              <TextInput
                value={newMarker?.coords![1] ? newMarker?.coords[1].toString() : ''}
                path={props.path || props.field.name}
                readOnly={true}
              />
            </div>
            <div>
              <FieldLabel label="Longitude" />
              <TextInput
                value={newMarker?.coords![0] ? newMarker?.coords[0].toString() : ''}
                path={props.path || props.field.name}
                readOnly={true}
              />
            </div>
            <div>
              <FieldLabel label="Marker Type" />
              <Select
                placeholder="Select a marker type"
                value={{ value: newMarker?.type, label: newMarker?.type }}
                onChange={(e: any) => {
                  setNewMarker({ ...newMarker, type: e.value })
                }}
                options={[
                  { label: 'Stillwater', value: 'stillwater' },
                  { label: 'River', value: 'river' },
                  { label: 'Parking', value: 'parking' },
                  { label: 'No Entry', value: 'no-entry' },
                  { label: 'Boundry', value: 'boundry' },
                ]}
              />
            </div>
            <div>
              <FieldLabel label="Description" />
              <TextInput
                value={newMarker?.description || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setNewMarker({
                    ...newMarker,
                    description: e.target.value,
                  })
                }}
                path={props.path || props.field.name}
                readOnly={false}
              />
            </div>
            <div>
              <FieldLabel label="Google Directions" />
              <CheckboxInput
                checked={newMarker?.directions}
                onToggle={(e) => {
                  setNewMarker({
                    ...newMarker,
                    directions: e.target.checked,
                  })
                }}
                readOnly={false}
              />
            </div>

            <div className="buttons-row">
              {method === 'create' && (
                <Button onClick={() => add()} className="submit">
                  Add
                </Button>
              )}
              {method === 'update' && (
                <>
                  <Button
                    onClick={() => {
                      setSettingsVisible(false)
                      update()
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => {
                      setSettingsVisible(false)
                      remove()
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button onClick={() => setSettingsVisible(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
