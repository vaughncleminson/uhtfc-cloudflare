'use client'
import { Marker } from '@/admin/types/marker'
import { MapBlock } from '@/payload-types'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef, useState } from 'react'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function Map(props: MapBlock) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [destinationMarker, setDestinationMarker] = useState<Marker | null>(null)
  // const [newMarkers, setNewMarkers] = useState<mapboxgl.Marker[]>([])

  // "https://www.google.com/maps/dir/?api=1&destination=${marker.coords![1]},${marker.coords![0]}"

  useEffect(() => {
    mapboxgl.accessToken = mapboxgl.accessToken
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [29.493226, -29.78995],
      zoom: 12,
    })
    const markers = props.map as any[]

    markers.forEach((marker, index) => {
      const myMarker = generateMarker(marker)
      let popup: mapboxgl.Popup | null = null
      const m: mapboxgl.Marker = new mapboxgl.Marker(myMarker).setLngLat({
        lng: marker.coords![0],
        lat: marker.coords![1],
      })
      if (marker.type == 'parking') {
        setDestinationMarker(marker)
      }
      if (marker.description && marker.description.length > 0) {
        popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(
          `<p style="font-size:15px; width:100%; text-align:center; margin-bottom:5px;">${marker.description}</p>`,
        )
        m.setPopup(popup)
      }
      m.getElement().setAttribute('id', `${marker.id}`)
      // m.getElement().addEventListener('click', (e) => markerClickHandler(e))
      m.addTo(map.current!)
    })

    map.current!.fitBounds(locationBounds(markers), {
      duration: 0,
      padding: { top: 200, bottom: 200, left: 200, right: 200 },
    })

    return () => {
      map.current!.remove()
    }
  }, [])

  const locationBounds = (markers: Marker[]): mapboxgl.LngLatBounds => {
    const bounds = new mapboxgl.LngLatBounds()
    for (let i = 0; i < markers!.length; i++) {
      bounds.extend([markers![i].coords![0], markers![i].coords![1]])
    }
    return bounds
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

  return (
    <div
      id="map"
      onClick={() => setFullscreen(true)}
      className={`${fullscreen ? 'fixed z-50 top-0' : 'relative'} h-screen w-full`}
    >
      {!fullscreen && (
        <div className="absolute flex justify-center items-center top-0 left-0 z-20 w-full h-full bg-white bg-opacity-10">
          <div className="text-slate border border-black bg-white px-4 py-3">Click to Explore</div>
        </div>
      )}
      {fullscreen && (
        <>
          {destinationMarker && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${destinationMarker.coords![1]},${destinationMarker.coords![0]}`}
              target="_blank"
            >
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-white bg-opacity-10">
                <div className="text-slate border border-black bg-white px-4 py-3">
                  Directions on Google Maps
                </div>
              </div>
            </a>
          )}

          <div
            onClick={(e) => {
              e.stopPropagation()
              setFullscreen(false)
            }}
            className="absolute cursor-pointer z-20 top-10 right-10 bg-black w-10 h-10 flex justify-center items-center"
          >
            <FontAwesomeIcon className="text-white text-xl" icon={faTimes} />
          </div>
        </>
      )}
      <div className="relative h-full w-full" id="map-container" ref={mapContainer}></div>
    </div>
  )
}
