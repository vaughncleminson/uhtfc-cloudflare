'use client'
import { Marker } from '@/admin/types/marker'
import { Location } from '@/payload-types'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Where } from 'payload'
import qs from 'qs'
import { useEffect, useRef, useState } from 'react'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function MapDefault() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [markers, setMarkers] = useState<Marker[]>([])

  useEffect(() => {
    const fetchLocations = async () => {
      const whereQuery: Where = {
        enabled: {
          equals: true,
        },
      }
      const queryString = qs.stringify({ where: whereQuery, limit: 0 }, { addQueryPrefix: true })
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/locations${queryString}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        const data = await req.json()
        getMarkers(data.docs)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchLocations()
  }, [])

  const getMarkers = async (locations: Location[]) => {
    const locMarkers: Marker[] = []
    locations.forEach((location) => {
      const locationDetails = location.layout.find((block) => block.blockType === 'map')
      if (locationDetails) {
        const m = locationDetails.map as Marker[]
        let mainLocation = m.find((e) => e.type === 'stillwater' || e.type === 'river')

        if (mainLocation) {
          mainLocation.slug = location.slug as string
          locMarkers.push(mainLocation)
        }
      }
    })
    setMarkers(locMarkers)
  }

  useEffect(() => {
    if (markers.length > 0) {
      mapboxgl.accessToken = mapboxgl.accessToken
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [29.493226, -29.78995],
        zoom: 12,
      })

      markers.forEach((marker, index) => {
        const myMarker = generateMarker(marker)
        let popup: mapboxgl.Popup | null = null
        const m: mapboxgl.Marker = new mapboxgl.Marker(myMarker).setLngLat({
          lng: marker.coords![0],
          lat: marker.coords![1],
        })

        if (marker.description && marker.description.length > 0) {
          popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(
            `<p style="font-size:15px; width:100%; text-align:center; margin-bottom:5px;">${marker.description}</p><a style="outline:none;" href="our-water/${marker.type}s/${marker.slug}"><button style="border-style:solid; border-width:1px; border-color:grey; padding:5px 10px; width:100%;">View</button></a>`,
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
    }
  }, [markers])

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
        <div className="absolute flex justify-center items-center top-0 left-0 z-20 w-full h-full bg-white bg-opacity-30">
          <div className="text-slate border border-black bg-white px-4 py-3">Click to Explore</div>
        </div>
      )}
      {fullscreen && (
        <div
          onClick={(e) => {
            e.stopPropagation()
            setFullscreen(false)
          }}
          className="absolute cursor-pointer z-20 top-10 right-10 bg-black w-10 h-10 flex justify-center items-center"
        >
          <FontAwesomeIcon className="text-white text-xl" icon={faTimes} />
        </div>
      )}
      <div className="relative h-full w-full" id="map-container" ref={mapContainer}></div>
    </div>
  )
}
