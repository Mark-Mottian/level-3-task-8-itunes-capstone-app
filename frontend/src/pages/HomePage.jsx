import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";

import FavouritesList from "../components/FavouritesList";
import ResultCard from "../components/ResultCard";
import SearchForm from "../components/SearchForm";

/* <=== HOME PAGE ===> */

function HomePage() {
  /*
   * HomePage owns the main app state.
   * The search form, results section and favourites list all connect through this page.
   */
  const [apiToken, setApiToken] = useState("");
  const [results, setResults] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSearchMessage, setLastSearchMessage] = useState("");

  /*
   * Task requirement:
   * Use JWT to authorise API requests and secure the API.
   *
   * The app gets an app-level token when the page first loads.
   * That token is later sent with search requests to the protected backend route.
   */
  useEffect(() => {
    getAppToken();
  }, []);

  /* <=== GET APP TOKEN ===> */

  async function getAppToken() {
    try {
      setIsLoadingToken(true);
      setErrorMessage("");

      /*
       * The token route does not log in a user.
       * It only gives the frontend a JWT for authorised API calls.
       */
      const response = await axios.get("/api/auth/token");

      setApiToken(response.data.token);
    } catch (error) {
      setErrorMessage("Could not prepare the search API. Please try again.");
    } finally {
      setIsLoadingToken(false);
    }
  }

  /* <=== AUTH HEADER HELPER ===> */

  function getAuthHeaders() {
    /*
     * The backend middleware expects a Bearer token in the Authorization header.
     * Keeping this in one helper prevents repeated header setup inside every request.
     */
    return {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };
  }

  /* <=== SEARCH REQUEST ===> */

  async function handleSearch({ searchTerm, mediaType }) {
    try {
      setIsSearching(true);
      setErrorMessage("");
      setLastSearchMessage("");

      /*
       * Task requirement:
       * The frontend must pass search data to the backend so the backend can call the iTunes API.
       *
       * The frontend does not call iTunes directly.
       * It calls Express, and Express verifies the JWT before using Axios to query iTunes.
       */
      const response = await axios.get("/api/search", {
        ...getAuthHeaders(),
        params: {
          term: searchTerm,
          media: mediaType,
        },
      });

      /*
       * Store the cleaned backend results in React state so they can be displayed as cards.
       */
      setResults(response.data.results);

      setLastSearchMessage(
        `Found ${response.data.resultCount} result${
          response.data.resultCount === 1 ? "" : "s"
        } for "${searchTerm}".`,
      );
    } catch (error) {
      /*
       * Prefer the backend message because the backend knows whether the failure was validation,
       * authorization or an external iTunes API problem.
       */
      const backendMessage =
        error.response?.data?.message || "Search failed. Please try again.";

      setErrorMessage(backendMessage);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  /* <=== ADD FAVOURITE ===> */

  function handleAddFavourite(itemToAdd) {
    /*
     * Task requirement:
     * Users must be able to add items to a favourites list.
     *
     * Avoid duplicate favourites by checking whether the item is already saved.
     */
    const alreadyFavourite = favourites.some((item) => item.id === itemToAdd.id);

    if (alreadyFavourite) {
      return;
    }

    /*
     * React state is updated immutably by creating a new array.
     * The selected item is placed first so the newest favourite is easiest to see.
     */
    setFavourites((previousFavourites) => [itemToAdd, ...previousFavourites]);
  }

  /* <=== REMOVE FAVOURITE ===> */

  function handleRemoveFavourite(itemId) {
    /*
     * Task requirement:
     * Users must be able to remove items from the favourites list.
     *
     * .filter() creates a new array without the selected item.
     */
    setFavourites((previousFavourites) =>
      previousFavourites.filter((item) => item.id !== itemId),
    );
  }

  /* <=== TOKEN LOADING STATE ===> */

  if (isLoadingToken) {
    return (
      <main className="bg-light min-vh-100 d-flex align-items-center">
        <Container className="text-center">
          <Spinner animation="border" role="status" />
          <p className="text-muted mt-3 mb-0">Preparing search...</p>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-light min-vh-100 py-5">
      <Container>
        {/* <=== PAGE HEADER ===> */}
        <section className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3">iTunes Search Favourites</h1>
          <p className="lead text-muted mb-0">
            Search the iTunes Store and Apple Books, then save your favourites.
          </p>
        </section>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <SearchForm
          onSearch={handleSearch}
          isSearching={isSearching}
          tokenReady={Boolean(apiToken)}
        />

        <Row className="g-4">
          {/* <=== SEARCH RESULTS SECTION ===> */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h4 fw-bold mb-0">Results</h2>

                  {isSearching && <Spinner animation="border" size="sm" />}
                </div>

                {lastSearchMessage && (
                  <Alert variant="info">{lastSearchMessage}</Alert>
                )}

                {results.length === 0 && !isSearching ? (
                  <Alert variant="secondary" className="mb-0">
                    Search results will appear here.
                  </Alert>
                ) : (
                  <Row className="g-3">
                    {results.map((item) => {
                      /*
                       * isFavourite controls whether the card shows Add favourite or Remove favourite.
                       */
                      const isFavourite = favourites.some(
                        (favourite) => favourite.id === item.id,
                      );

                      return (
                        <Col key={item.id} xs={12} md={6} xl={4}>
                          <ResultCard
                            item={item}
                            isFavourite={isFavourite}
                            onAddFavourite={handleAddFavourite}
                            onRemoveFavourite={handleRemoveFavourite}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* <=== FAVOURITES SECTION ===> */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h4 fw-bold mb-0">Favourites</h2>
                  <span className="badge text-bg-primary">{favourites.length}</span>
                </div>

                <FavouritesList
                  favourites={favourites}
                  onRemoveFavourite={handleRemoveFavourite}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              /*
               * Clear only the displayed search results.
               * Favourites remain because they are managed separately in their own state array.
               */
              setResults([]);
              setLastSearchMessage("");
              setErrorMessage("");
            }}
          >
            Clear results
          </Button>
        </div>
      </Container>
    </main>
  );
}

export default HomePage;
