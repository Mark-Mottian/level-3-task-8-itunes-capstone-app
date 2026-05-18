import { useFormik } from "formik";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

/* <=== MEDIA TYPE OPTIONS ===> */

/*
 * Task requirement:
 * The user must be able to enter a search term and select the type of media to search for.
 *
 * These dropdown values match the media values accepted by the backend and iTunes Search API.
 */
const mediaOptions = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movie" },
  { value: "podcast", label: "Podcast" },
  { value: "music", label: "Music" },
  { value: "musicVideo", label: "Music video" },
  { value: "audiobook", label: "Audiobook" },
  { value: "shortFilm", label: "Short film" },
  { value: "tvShow", label: "TV show" },
  { value: "software", label: "Software" },
  { value: "ebook", label: "Ebook" },
];

/*
 * Task Requirement:
 * Add search term length validation.
 *
 * Keeping the limit in a constant avoids a "magic number" being repeated in the form logic.
 */
const MAX_SEARCH_TERM_LENGTH = 100;

/* <=== SEARCH FORM COMPONENT ===> */

function SearchForm({ onSearch, isSearching, tokenReady }) {
  /*
   * Formik owns the search form state.
   * This keeps values, validation and submit handling in one predictable place.
   */
  const formik = useFormik({
    initialValues: {
      searchTerm: "",
      mediaType: "all",
    },
    validate: validateSearchForm,
    onSubmit: handleSubmit,
  });

  /*
   * Task Requirement:
   * Show the user how close the search term is to the maximum allowed length.
   */
  const searchTermLength = formik.values.searchTerm.length;
  const isSearchTermTooLong = searchTermLength > MAX_SEARCH_TERM_LENGTH;

  /* <=== FORM VALIDATION ===> */

  function validateSearchForm(values) {
    const errors = {};

    /*
     * The iTunes API needs a search term to return useful results.
     * Frontend validation gives quick feedback before any API request is made.
     */
    if (!values.searchTerm.trim()) {
      errors.searchTerm = "Enter a search term.";
    }

    /*
     * Task Requirement:
     * Block unnecessarily long search terms before the frontend sends a request.
     */
    if (values.searchTerm.length > MAX_SEARCH_TERM_LENGTH) {
      errors.searchTerm = `Search term must be ${MAX_SEARCH_TERM_LENGTH} characters or fewer.`;
    }

    return errors;
  }

  /* <=== SUBMIT HANDLER ===> */

  function handleSubmit(values) {
    /*
     * This component does not call the API directly.
     * It passes clean form values to HomePage, which owns the search request and result state.
     */
    onSearch({
      searchTerm: values.searchTerm.trim(),
      mediaType: values.mediaType,
    });
  }

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body className="p-4">
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Row className="g-3 align-items-start">
            <Col md={7}>
              <Form.Group controlId="searchTerm">
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Label className="fw-semibold">Search term</Form.Label>

                  {/* Task Requirement: show a search term character count. */}
                  <small
                    className={
                      isSearchTermTooLong ? "text-danger" : "text-muted"
                    }
                  >
                    {searchTermLength}/{MAX_SEARCH_TERM_LENGTH}
                  </small>
                </div>

                <Form.Control
                  name="searchTerm"
                  type="text"
                  placeholder="Search albums, artists, movies or books"
                  value={formik.values.searchTerm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.searchTerm &&
                    Boolean(formik.errors.searchTerm)
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {formik.errors.searchTerm}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="mediaType">
                <Form.Label className="fw-semibold">Media type</Form.Label>

                <Form.Select
                  name="mediaType"
                  value={formik.values.mediaType}
                  onChange={formik.handleChange}
                >
                  {mediaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Label className="d-none d-md-block">&nbsp;</Form.Label>

              <Button
                type="submit"
                className="w-100"
                /*
                 * Task Requirement:
                 * Disable search when the search term is too long so invalid requests are not submitted.
                 */
                disabled={isSearching || !tokenReady || isSearchTermTooLong}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default SearchForm;