import { Request, Response, Router } from "express";
import Usage from "../models/Usage";

const router: Router = Router();

router.post('/usage', async (req: Request, res: Response) => {
    const data = new Usage({
        device: req.body.device,
        customer: req.body.customer,
        startDate: req.body.start,
        endDate: req.body.end,
        totalUsageCost: req.body.totalUsageCost
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error})
    }
})

router.get('/usage', async (req: Request, res: Response) => {
    try{
        const data = await Usage.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})

router.get('/usage/:id', async (req: Request, res: Response) => {
    try{
        const data = await Usage.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})
router.get('/usage-start-period', async (req: Request, res: Response) => {
    try{
        const data = await Usage.find();
        const dataInPeriod = data.filter((usage: any) =>
            new Date(usage.startDate).getTime() > new Date(req.body.from).getTime() &&
            new Date(usage.startDate).getTime() < new Date(req.body.to).getTime())
        res.json(dataInPeriod)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})
router.get('/usage-end-period', async (req: Request, res: Response) => {
    try{
        const data = await Usage.find();
        const dataInPeriod = data.filter((usage: any) =>
            new Date(usage.endDate).getTime() > new Date(req.body.from).getTime() &&
            new Date(usage.endDate).getTime() < new Date(req.body.to).getTime())
        res.json(dataInPeriod)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})
router.get('/usage-customer/:customer', async (req: Request, res: Response) => {
    try{
        const data = await Usage.find();
        const dataInPeriod = data.filter((usage: any) =>
            usage.customer.toString() === req.params.customer
        )
        res.json(dataInPeriod)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})
router.get('/usage-customer-sum/:customer', async (req: Request, res: Response) => {
    try{
        const data = await Usage.find();
        const dataInPeriod = data.filter((usage: any) =>
            usage.customer.toString() === req.params.customer
        )
        let sum = 0;
        dataInPeriod.forEach((usage: any) => sum += usage.totalUsageCost);
        res.json(sum)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})
router.get('/usage-customer-sum-period/:customer', async (req: Request, res: Response) => {
    try{
        const data = await Usage.find();
        const dataInPeriod = data.filter((usage: any) =>
            usage.customer.toString() === req.params.customer &&
            new Date(usage.endDate).getTime() > new Date(req.body.from).getTime() &&
            new Date(usage.endDate).getTime() < new Date(req.body.to).getTime()
        )
        let sum = 0;
        dataInPeriod.forEach((usage: any) => sum += usage.totalUsageCost);
        res.json(sum)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})
router.delete('/usage/:id', async (req: Request, res: Response) => {
    try{
        const id = req.params.id;
        await Usage.findByIdAndDelete(id)
        const data = await Usage.find();
        res.send(data);
    }
    catch(error){
        res.status(500).json({message: error})
    }
})

router.put('/usage/:id', async (req: Request, res: Response) => {
    try{
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Usage.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})


export default router;