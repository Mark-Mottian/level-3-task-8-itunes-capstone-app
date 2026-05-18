import { Alert, Button, Card, Col, Row } from "react-bootstrap";

/* <=== FAVOURITES LIST COMPONENT ===> */

function FavouritesList({ favourites, onRemoveFavourite }) {
  /*
   * Task requirement:
   * Users must be able to add and remove items from a favourites list.
   *
   * Task note:
   * The favourites list does not need to be remembered after the user exits the app.
   * Therefore, favourites are stored only in React state and not in a database or localStorage.
   */
  if (favourites.length === 0) {
    return (
      <Alert variant="secondary" className="mb-0">
        No favourites yet. Add items from the search results.
      </Alert>
    );
  }

  return (
    <Row className="g-3">
      {favourites.map((item) => (
        <Col key={item.id} xs={12}>
          {/*
            Each favourite uses the full width of the favourites panel.
            This keeps the saved item readable instead of squeezing it into smaller columns.
          */}
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex gap-3 align-items-start">
              {item.artworkUrl && (
                <img
                  src={item.artworkUrl}
                  alt={item.collectionName}
                  width="72"
                  height="72"
                  className="rounded flex-shrink-0"
                  style={{ objectFit: "cover" }}
                />
              )}

              <div className="flex-grow-1">
                <h3 className="h6 mb-1 text-break">{item.collectionName}</h3>

                <p className="text-muted small mb-2 text-break">
                  {item.artistName}
                </p>

                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onRemoveFavourite(item.id)}
                >
                  Remove
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default FavouritesList;
