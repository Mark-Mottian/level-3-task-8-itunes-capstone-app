import axios from "axios";

/* <=== MEDIA TYPE CONFIGURATION ===> */

/*
 * Task requirement:
 * The user must be able to choose the type of media they want to search for.
 *
 * These values match the iTunes Search API media options used by the frontend dropdown.
 * Keeping the accepted values in one array makes the backend validation clear and predictable.
 */
const VALID_MEDIA_TYPES = [
  "all",
  "movie",
  "podcast",
  "music",
  "musicVideo",
  "audiobook",
  "shortFilm",
  "tvShow",
  "software",
  "ebook",
];

/*
 * Task Requirement:
 * Add search term length validation.
 *
 * The backend repeats the limit as a safety check in case someone bypasses the frontend.
 */
const MAX_SEARCH_TERM_LENGTH = 100;

/* <=== RESULT NORMALIZER ===> */

function normalizeItunesResult(item) {
  /*
   * The iTunes API returns different field names depending on the result type.
   * Music results, movie results and book results do not always have the exact same shape.
   *
   * This function converts every result into one frontend-friendly object so the React cards
   * do not need to know every possible iTunes response variation.
   */
  const artworkUrl = item.artworkUrl100
    ? item.artworkUrl100.replace("100x100bb", "600x600bb")
    : "";

  /*
   * Prefer the most stable iTunes identifiers first.
   * The string fallback prevents React key errors if a result does not include an id field.
   */
  const id =
    item.trackId ||
    item.collectionId ||
    item.artistId ||
    `${item.artistName}-${item.trackName}-${item.collectionName}`;

  return {
    id,

    /*
     * Some results use trackName and others use collectionName.
     * The frontend uses collectionName as the main display title.
     */
    title: item.trackName || item.collectionName || "Untitled",
    collectionName: item.collectionName || item.trackName || "Unknown collection",

    /*
     * artistName is displayed on both result cards and favourite cards.
     */
    artistName: item.artistName || "Unknown artist",

    /*
     * The larger artwork URL gives the Bootstrap cards a sharper image.
     */
    artworkUrl,

    /*
     * releaseDate is converted to a year on the frontend.
     */
    releaseDate: item.releaseDate || "",

    /*
     * mediaType gives the user context about what kind of result they are viewing.
     */
    mediaType: item.kind || item.wrapperType || "unknown",

    /*
     * previewUrl and viewUrl are optional because not every iTunes result includes them.
     */
    previewUrl: item.previewUrl || "",
    viewUrl: item.trackViewUrl || item.collectionViewUrl || "",
  };
}

/* <=== ITUNES SEARCH CONTROLLER ===> */

export async function searchItunes(req, res) {
  try {
    /*
     * Task requirement:
     * The backend must process API requests and communicate with the iTunes Search API.
     *
     * The frontend sends the search term and selected media type as query parameters.
     */
    const searchTerm = req.query.term?.trim();
    const mediaType = req.query.media || "all";

    /*
     * The iTunes API needs a real search term.
     * Returning a 400 here avoids making an unnecessary external API request.
     */
    if (!searchTerm) {
      return res.status(400).json({
        message: "Search term is required.",
      });
    }

    /*
     * Task Requirement:
     * Reject overlong search terms on the backend as well.
     *
     * This protects the API even if a request is made without using the React form.
     */
    if (searchTerm.length > MAX_SEARCH_TERM_LENGTH) {
      return res.status(400).json({
        message: `Search term must be ${MAX_SEARCH_TERM_LENGTH} characters or fewer.`,
      });
    }

    /*
     * Validate the media type before passing it to iTunes.
     * This keeps the backend API controlled even if someone bypasses the frontend dropdown.
     */
    if (!VALID_MEDIA_TYPES.includes(mediaType)) {
      return res.status(400).json({
        message: "Invalid media type.",
      });
    }

    /*
     * Axios sends the request to the official iTunes Search API.
     * params lets Axios safely build the query string for term, media and limit.
     */
    const itunesResponse = await axios.get("https://itunes.apple.com/search", {
      params: {
        term: searchTerm,
        media: mediaType,
        limit: 24,
      },
    });

    /*
     * Task requirement:
     * Retrieve useful album/content information such as name, artist, cover image and release date.
     *
     * The raw iTunes results are normalised before being sent to React.
     */
    const normalizedResults = itunesResponse.data.results.map(normalizeItunesResult);

    /*
     * The frontend receives only the data it needs to display result cards and manage favourites.
     */
    return res.status(200).json({
      resultCount: normalizedResults.length,
      results: normalizedResults,
    });
  } catch (error) {
    /*
     * External API errors are logged on the backend for debugging.
     * The frontend receives a clear message without needing to know the internal Axios details.
     */
    console.log("Error in searchItunes controller:", error.message);

    return res.status(500).json({
      message: "Something went wrong while searching iTunes.",
    });
  }
}