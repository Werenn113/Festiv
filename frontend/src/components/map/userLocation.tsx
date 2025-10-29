import { useEffect, useState } from "react"

export function UserLocation() {
    const [location, setLocation] = useState({ latitude: null, longitude: null })
    const [error, setError] = useState(null)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    })
                },
                (err) => {
                    setError(err.message)
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0
                }
            )
        } else {
            setError("La géolocalisation n'est pas supporté par ce navigateur")
        }
    }, [])

    return (
        <div>
            {error ? (
                <p>Erreur : {error}</p>
            ) : (
                <p>
                    Latitude: {location.latitude} <br />
                    Longitude: {location.longitude}
                </p>
            )}
        </div>
    )
}