import express, { Response } from "express";
import { protect } from "../middleware/auth";
import Training from "../models/Training";
import { AuthRequest } from "../types";
import TrainingType from "../models/TrainingType";

const router = express.Router();

// @route   POST /api/trainings
// @desc    Get all trainings for a user
// @access  Private
router.post("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { selected } = req.body;
    const training = await Training.findOne({
      user: req.user?._id,
      date: new Date(selected),
    })
      .populate("types")
      .lean();

    if (!training) {
      const initialTraining = await Training.create({
        user: req.user?._id,
        date: new Date(selected),
      });

      res.json(initialTraining);
      return;
    }

    res.json(training);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @route   POST /api/trainings
// @desc    Create a new training
// @access  Private
router.post(
  "/create-type",
  protect,
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, type, _id } = req.body;

      const trainingType = await TrainingType.create({
        name,
        type,
      });

      await Training.findByIdAndUpdate(_id, {
        $push: {
          types: trainingType._id,
        },
      });

      res.status(201).json(trainingType);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

router.post(
  "/update-duration",
  protect,
  async (req: AuthRequest, res: Response) => {
    try {
      const { duration, _id } = req.body;
      const training = await Training.findByIdAndUpdate(_id, {
        duration,
      });

      res.json(training);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

router.post(
  "/update-repetitions",
  protect,
  async (req: AuthRequest, res: Response) => {
    try {
      const { repetitions, _id } = req.body;
      const training = await TrainingType.findByIdAndUpdate(_id, {
        repetitions,
      });

      res.json(training);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// @route   GET /api/trainings/:id
// @desc    Get a training by ID
// @access  Private
router.get(
  "/:id",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const training = await Training.findById(req.params.id).lean();

      if (!training) {
        res.status(404).json({ message: "Training not found" });
        return;
      }

      // Check if training belongs to user
      if (training.user.toString() !== req.user?._id.toString()) {
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
      let training = await Training.findById(req.params.id).lean();

      if (!training) {
        res.status(404).json({ message: "Training not found" });
        return;
      }

      // Check if training belongs to user
      if (training.user.toString() !== req.user?._id.toString()) {
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
      const training = await Training.findById(req.params.id).lean();

      if (!training) {
        res.status(404).json({ message: "Training not found" });
        return;
      }

      if (training.user.toString() !== req.user?._id.toString()) {
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
