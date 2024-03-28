import {Card, List, Navbar, Page} from "konsta/react";
import useWeatherData from "../hooks/use-weather-data.ts";
import useLocations from "../hooks/use-locations.ts";
import {useEffect, useState} from "react";
import {weatherDataPointSerializer} from "../utils/serializers.ts";
import useConfig from "../hooks/use-config.ts";
import {Link} from "react-router-dom";
import NoWindIcon from "../icons/NoWindIcon.tsx";
import WindsockIcon from "../icons/WindsockIcon.tsx";

const HomePage = () => {
    const [locationsWithData, setLocationsWithData] = useState([]); // [1
    const {data: weatherData} = useWeatherData();
    const {data: locations} = useLocations();
    const {getLocationDisplayStatus} = useConfig();

    useEffect(() => {
        if (!locations || !weatherData) {
            return;
        }
        const newLocationData = locations?.map((location) => {
            const dataPoint = weatherData?.find((dataPoint) => dataPoint.location_uuid === location.uuid);
            return {
                ...location,
                data: weatherDataPointSerializer(dataPoint)
            }
        });
        setLocationsWithData(newLocationData);
    }, [locations, weatherData]);

    return (
        <Page>
            <Navbar
                title={(
                    <h1>Windsock</h1>
                )}
                centerTitle={true}
            />
            <List>
                {locationsWithData && locationsWithData.map((location) => {
                    if (!getLocationDisplayStatus(location.uuid)) {
                        return null;
                    }
                    const degToRotate = parseInt(location.data?.dir_mag_unformatted) - 45;
                    const degIsNumber = !isNaN(degToRotate);
                    return (
                        <Card
                            key={location.uuid}
                        >
                            <div
                                className={"flex justify-between"}
                            >
                                <div
                                    className={"flex flex-col items-start space-y-1"}
                                >
                                    <p
                                        className="text-md font-semibold"
                                    >{location.name}</p>
                                    <p
                                        className={"pl-2"}
                                    >{location.data?.temp}°C</p>
                                    <p
                                        className="bg-slate-600 text-white rounded-full px-2 py-1"
                                    >{location.data?.windspeed_ave}</p>
                                </div>
                                <div
                                    className={"flex items-center px-5"}
                                >
                                    {degIsNumber ? (
                                        <div
                                            className="flex flex-col items-center"
                                        >
                                            <WindsockIcon
                                                className={`${location.name}:: text-gray-800 h-12 w-12 transform rotate-[${degToRotate}deg]`}
                                            />
                                            <p>{location.data?.dir_mag}</p>
                                        </div>
                                    ) : (
                                        <NoWindIcon
                                            className={"text-gray-800 h-12 w-12"}
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </List>
            {/* If there are no locations selected to display, show a message. */}
            {locationsWithData && locationsWithData.filter(location => getLocationDisplayStatus(location.uuid)).length === 0 && (
                <
                >
                    <p
                        className="text-center text-gray-500"
                    >Please selected at least one location to display.</p>
                    <Link to="/settings" className="text-blue-600">Go to settings Page</Link>
                </>
            )}

        </Page>
    )
}
export default HomePage;