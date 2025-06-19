const express = require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //for storage of image


router.get('/search', async (req, res) => {
  const { query } = req.query;
   console.log("Received search query:", query);

  if (!query) {
    return res.redirect('/listings'); // If no search term, redirect to all listings
  }

  // Build case-insensitive regex search for title, location, or country
  const searchRegex = new RegExp(query, 'i');

  try {
    const listings = await Listing.find({
      $or: [
        { title: searchRegex },
        { location: searchRegex },
        { country: searchRegex }
      ]
    });
    console.log("Number of matching listings:", listings.length)

    res.render('listings/index', { allListings: listings, searchQuery: query });
  } catch (err) {
    console.error(err);
    res.status(500).send("Search failed.")
  }
});

//Index route
router
    .route("/")
    .get(wrapAsync(listingsController.index))
    .post(
        isLoggedIn,
        
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingsController.createListing)
        
    );

//New Route
router.get("/new", isLoggedIn , listingsController.renderNewForm);

//Show route
router.get("/:id",  wrapAsync(listingsController.showListing));


//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm));

//Update route
router.put("/:id",isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,isLoggedIn, wrapAsync(listingsController.updateListing));

//Delete route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing));

module.exports = router;