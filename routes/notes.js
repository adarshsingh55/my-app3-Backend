const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var fetchuser = require("../midleware/fetchuser");
const Notes = require("../models/Notes");
//1 get all the notes
router.get("/fetchall", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id }).sort({date :'desc'});
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).send("some erro has occe in fetchall rout");
  }
});

//2 to add all the notes /api/notes/addnotes
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }), // validating
    body("description", "possword must be atlist 5 chr").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        tag,
        description,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.log(error);
      res.status(500).send("some erro has occe in addnotes rout");
    }
  }
);

//3 update the notes /api/notes/update
router.put(
  "/updatenote/:id",
  fetchuser,async (req, res) => {
    const { title, description, tag } = req.body;
    try {
    const newNote={}; 
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}
  
  // find the note to be update
let note =await Notes.findById(req.params.id)
  if(!note){ return res.status(400).send('note not found')}
  if(note.user.toString() !== req.user.id){
    return res.status(401).send('not allowed')
  }
  note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
  res.json({note})
} catch (error) {
  console.log(error);
  res.status(500).send("some erro has occe in update notes rout");
}
  }
  );
//4 delete the notes /api/notes/deletenote
router.delete(
  "/deletenote/:id",
  fetchuser,async (req, res) => {
    const { title, description, tag } = req.body;
  
    try {
  // find the note to be delete and delete
let note =await Notes.findById(req.params.id)
  if(!note){return res.status(400).send('note not found')}

  // allow delete only if user own it
  if(note.user.toString() !== req.user.id){
    return res.status(401).send('not allowed')
  }

  note = await Notes.findByIdAndDelete(req.params.id)
  res.json({"success":"note has been deleted",note:note})
} catch (error) {
  console.log(error);
  res.status(500).send("some erro has occe in addnotes rout");
}
  }
  );

module.exports = router;
