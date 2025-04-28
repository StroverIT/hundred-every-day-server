import express, { Response } from "express";
import { protect } from "../middleware/auth";
import Training from "../models/Training";
import { AuthRequest, ITraining, IUser } from "../types";

const router = express.Router();

// @route   GET /api/trainings
// @desc    Get all trainings for a user
// @access  Private
router.get("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const trainings = await Training.find({ user: req.user?._id });
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @route   POST /api/trainings
// @desc    Create a new training
// @access  Private
router.post("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, duration, date, type } = req.body;

    const training = await Training.create({
      title,
      description,
      duration,
      date,
      type,
      user: req.user?._id,
    });

    res.status(201).json(training);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @route   GET /api/trainings/:id
// @desc    Get a training by ID
// @access  Private
router.get(
  "/:id",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const training = await Training.findById(req.params.id);

      if (!training) {
        res.status(404).json({ message: "Training not found" });
        return;
      }

      // Check if training belongs to user
      if (training.user !== req.user?._id) {
        res.status(401).json({ message: "Not authorized" });
        return;
      }

      res.json(training);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// @route   PUT /api/trainings/:id
// @desc    Update a training
// @access  Private
router.put(
  "/:id",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      let training = await Training.findById(req.params.id);

      if (!training) {
        res.status(404).json({ message: "Training not found" });
        return;
      }

      // Check if training belongs to user
      if (training.user !== req.user?._id) {
        res.status(401).json({ message: "Not authorized" });
        return;
      }

      training = await Training.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.json(training);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// @route   DELETE /api/trainings/:id
// @desc    Delete a training
// @access  Private
router.delete(
  "/:id",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const training = await Training.findById(req.params.id);

      if (!training) {
        res.status(404).json({ message: "Training not found" });
        return;
      }

      if (training.user !== req.user?._id) {
        res.status(401).json({ message: "Not authorized" });
        return;
      }

      await Training.deleteOne({ _id: req.params.id });

      res.json({ message: "Training removed" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

export default router;
