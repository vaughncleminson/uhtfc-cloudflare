'use client'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import './index.scss'
import {
  Button,
  CheckboxInput,
  FieldLabel,
  JSONField,
  Select,
  TextInput,
  useField,
} from '@payloadcms/ui'
import { JSONFieldClientProps } from 'payload'
import { Marker } from '@/admin/types/marker'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export function Map(props: JSONFieldClientProps) {
  const { value, setValue } = useField<Marker[]>({ path: props.path || props.field.name })
  const [settingsVisible, setSettingsVisible] = useState(false)

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [newMarkers, setNewMarkers] = useState<Marker[]>(value)
  const [newMarker, setNewMarker] = useState<Marker | null>(null)
  const [displayMarkers, setDisplayMarkers] = useState<mapboxgl.Marker[]>([])
  const [selectedId, setSelectedId] = useState<number>(0)
  const [method, setMethod] = useState<string>('create')
  // const [lng, setLng] = useState(29.492799);
  // const [lat, setLat] = useState(-29.790711);
  // const [zoom, setZoom] = useState(12);
  // const detailMarkerArr = useRef<mapboxgl.Marker[]>([]);
  // const mainMarkerArr = useRef<mapboxgl.Marker[]>([]);
  // const locations = useRef<Location[] | undefined>();
  // const detailsAdded = useRef(true);
  // const [fullscreen, setFullscreen] = useState(false);
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
    if (newMarkers.length) {
      refreshMarkers(newMarkers)
    }
  }, [newMarkers])

  function refreshMarkers(markers: Marker[]) {
    removeAllMarkers()
    console.log(markers)
    markers.forEach((marker, index) => {
      const myMarker = generateMarker(marker)
      const m: mapboxgl.Marker = new mapboxgl.Marker(myMarker).setLngLat({
        lng: marker.coords![0],
        lat: marker.coords![1],
      })
      m.getElement().setAttribute('id', `${marker.id}`)
      m.getElement().addEventListener('click', (e) => markerClickHandler(e))

      displayMarkers.push(m)
      m.addTo(map.current!)
      setDisplayMarkers(displayMarkers)
    })

    if (locationBounds()._ne) {
      map.current!.fitBounds(locationBounds(), {
        duration: 0,
        padding: { top: 1000, bottom: 1000, left: 1000, right: 1000 },
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
    myMarker.style.backgroundImage = `url(/api/media/file/${markerType}.png)`
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
    for (let i = 0; i < newMarkers!.length; i++) {
      bounds.extend([newMarkers![i].coords![0], newMarkers![i].coords![1]])
    }
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
