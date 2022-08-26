import trafficModel from "../models/traffic";
import { DelayedStation, Station } from "../types";

const fetchStations = async () => {
    const response = await trafficModel.getStations();
    return response;
};

const fetchDelays = async () => {
    const response = await trafficModel.getDelays();
    return response;
};

const getDelays = async () => {
    const stations = await fetchStations();
    const delays = await fetchDelays();

    const delaysHasLocation = delays.filter((element: any) => {
        return element.FromLocation !== undefined;
    });

    const stationDelays = stations.map((fromStation: Station) => {
        const delay = delaysHasLocation.find((delay: DelayedStation) => {
            if (delay.FromLocation[0].LocationName === fromStation.LocationSignature) {
                return delay;
            }
        });

        if (delay) {
            const toStation = stations.find(
                (station: Station) => station.LocationSignature === delay.ToLocation[0].LocationName
            );
            const delayStation = { ...delay, fromStation, toStation };
            return delayStation;
        }
    });

    const fixedArray = stationDelays.filter((element: any) => {
        return element !== undefined;
    });
    return fixedArray;
};

// get message if match from and to station
const findMessages = async (fromStation: string) => {
    console.log("Checking messages for", fromStation);
    const messages = await trafficModel.getMessages();

    const msgArray = [];
    messages.map((message: any) => {
        if (message.TrafficImpact) {
            message.TrafficImpact.map((impact: any) => {
                if (impact.FromLocation[0] === fromStation) {
                    //console.log("Found message", message.Header);

                    msgArray.push(message);
                }
            });
        }
    });
    if (msgArray.length > 0) {
        return msgArray;
    } else return ["empty"];
};

export { getDelays, findMessages };
