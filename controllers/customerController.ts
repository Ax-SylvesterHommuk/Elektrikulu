import { Request, Response, Router } from "express";
import Customer from "../models/Customer";

const router: Router = Router();

router.post('/customer', async (req: Request, res: Response) => {
    const data = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error})
    }
})

router.get('/customer', async (req: Request, res: Response) => {
    try{
        const data = await Customer.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})

router.get('/customer/:id', async (req: Request, res: Response) => {
    try{
        const data = await Customer.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})

router.delete('/customer/:id', async (req: Request, res: Response) => {
    try{
        const id = req.params.id;
        await Customer.findByIdAndDelete(id)
        const data = await Customer.find();
        res.send(data);
    }
    catch(error){
        res.status(500).json({message: error})
    }
})

router.put('/customer/:id', async (req: Request, res: Response) => {
    try{
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Customer.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch(error){
        res.status(500).json({message: error})
    }
})


export default router;