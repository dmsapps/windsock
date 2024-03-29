import {BlockHeader, BlockTitle, List, ListItem, Navbar, Page, Toggle} from "konsta/react";
import useLocations from "../hooks/use-locations.ts";
import useConfig from "../hooks/use-config.ts";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

const SettingsPage = () => {
    const {data: locations} = useLocations();
    const {config, loading, toggleLocationDisplay} = useConfig();
    return (
        <Page>
            <Navbar
                title={(
                    <h1
                        className={"text-white text-xl"}
                    >Settings</h1>
                )}
                centerTitle={true}
                bgClassName={"bg-primary-700 rounded-b-xl"}
                titleClassName={"text-white text-2xl font-semibold"}
            />
            {!loading && (
                <>
                    <BlockTitle>Locations</BlockTitle>
                    <BlockHeader>Selected locations will be displayed on the home screen.</BlockHeader>
                    <List strong inset>
                        {locations?.map((location) => (
                            <ListItem
                                key={location.uuid}
                                label
                                title={location.name}
                                after={
                                    <Toggle
                                        component="div"
                                        className="-my-1"
                                        checked={config.locations.find(loc => loc.uuid === location.uuid)?.display || false}
                                        onChange={() => toggleLocationDisplay(location.uuid)}
                                    />
                                }
                            />))}
                    </List>
                </>
            )}
            {loading && (
                <div className="mt-5">
                    <LoadingSpinner/>
                </div>
            )}
        </Page>
    );
}
export default SettingsPage;