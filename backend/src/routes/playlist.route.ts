import express from "express";
import { playlistController } from "../controllers/playlist.controller";

const router = express.Router();

router.post("/", playlistController.createPlaylist);
router.get("/", playlistController.getUserAllPlaylists);
router.get("/:playlistId", playlistController.getUserPlaylist);
router.put("/:playlistId", playlistController.editPlaylist);
router.put("/:playlistId/add", playlistController.addFoodToPlaylist);
router.delete("/:playlistId/:foodId", playlistController.deleteFoodFromPlaylist);
router.delete("/:playlistId", playlistController.deletePlaylist);

export default router;
