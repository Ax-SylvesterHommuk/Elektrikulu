import { Request, Response, Router } from "express";
import Device from "../models/Device";

const router: Router = Router();

router.post('/device', async (req: Request, res: Response) => {
    const data = new Device({
        name: req.body.name,
        consumption: req.body.consumption
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error})
    }
})
router.post('/save-many-devices', async (req: Request, res: Response) => {
    try {
        req.body.appliances.forEach(async (element: {appliance: string, watts: number})=> {
            const data = new Device({
                name: element.appliance,
                consumption: element.watts
            })
            await data.save();
        })

        res.status(200).json("ALL DATA SAVED");
    }
    catch (error) {
        res.status(400).json({message: error})
    }
})
router.get('/device', async (req: Request, res: Response) => {
    try{
        const data = await Device.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})

router.get('/device/:id', async (req: Request, res: Response) => {
    try{
        const data = await Device.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})

router.delete('/device/:id', async (req: Request, res: Response) => {
    try{
        const id = req.params.id;
        await Device.findByIdAndDelete(id)
        const data = await Device.find();
        res.send(data);
    }
    catch(error){
        res.status(500).json({message: error})
    }
})

router.put('/device/:id', async (req: Request, res: Response) => {
    try{
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Device.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})


export default router;