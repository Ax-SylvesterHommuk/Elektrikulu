import { Request, Response, Router } from "express";
import Usage from "./models/Usage";
import Device from "./models/Device";
import axios from "axios";

const router: Router = Router();

router.post('/usage', async (req: Request, res: Response) => {
    // Saame algus- ja lõppkuupäevad päringust
    const startOfUse = req.body.start; // Vorming: "2023-03-14T02:40"
    const endOfUse = req.body.end; // Vorming: "2023-03-14T08:35"

    // Konverteerime kuupäevad Date objektideks
    const startDate = new Date(startOfUse);
    const endDate = new Date(endOfUse);

    // Saame elektrienergia hinna andmed Eleringi API kaudu
    const response = await axios.get(
        `https://dashboard.elering.ee/api/nps/price?start=${startOfUse.split(":")[0]}:00:00.000Z&end=${endOfUse}:00.000Z`
    );

    let sum = 0;
    const prices = response.data.data.ee.slice(); // Kasutame ainult Eesti aega

    if (prices.length === 1) {
        // Kui kasutusaeg jääb ühe tunni piiresse
        const cost = prices[0].price * (endDate.getMinutes() - startDate.getMinutes()) / 60;
        sum += cost;
    }

    if (prices.length > 1) {
        // Kui kasutusaeg hõlmab mitut tundi
        const costFirstHour = prices[0].price * (60 - startDate.getMinutes()) / 60;
        sum += costFirstHour;
        const costLastHour = prices[prices.length - 1].price * endDate.getMinutes() / 60;
        sum += costLastHour;
    }

    if (prices.length > 2) {
        // Kui kasutusaeg hõlmab rohkem kui kahte tundi
        prices.splice(0, 1); // Eemaldame esimese hinna, kuna see on juba kokku arvatud
        prices.splice(prices.length - 1); // Eemaldame viimase hinna, kuna see on juba kokku arvatud
        prices.forEach((element: any) => sum += element.price);
    }

    try {
        // Leia seade, et leida selle tarbimine wattides
        const device = await Device.findById(req.body.device);
        if (device) {
            // Arvuta kokku tarbitud elektrienergia kogukulu
            const totalUsageCost = sum / 1000000 * device?.consumption;
            console.log(device?.consumption);
            console.log(totalUsageCost);

            // Salvesta tarbimise andmed andmebaasi
            const data = new Usage({
                device: req.body.device,
                customer: req.body.customer,
                startDate: req.body.start,
                endDate: req.body.end,
                totalUsageCost: totalUsageCost
            });

            const dataToSave = await data.save();
            res.status(200).json(dataToSave);
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
});