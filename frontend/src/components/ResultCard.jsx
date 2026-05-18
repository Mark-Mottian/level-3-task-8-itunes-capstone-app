import { Badge, Button, Card } from "react-bootstrap";

/* <=== RESULT CARD COMPONENT ===> */

function ResultCard({ item, isFavourite, onAddFavourite, onRemoveFavourite }) {
  /*
   * The iTunes API returns releaseDate as a full date string.
   * The card only needs the year, which is easier to read in a compact layout.
   */
  const releaseYear = item.releaseDate
    ? new Date(item.releaseDate).getFullYear()
    : "Unknown";

  return (
    <Card className="h-100 border-0 shadow-sm">
      {item.artworkUrl ? (
        <Card.Img
          variant="top"
          src={item.artworkUrl}
          alt={item.collectionName}
          style={{ objectFit: "cover", height: "220px" }}
        />
      ) : (
        <div
          className="bg-secondary-subtle d-flex align-items-center justify-content-center text-muted"
          style={{ height: "220px" }}
        >
          No image
        </div>
      )}

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          {/*
            mediaType comes from the backend normalised result.
            It helps the user understand what kind of content each result represents.
          */}
          <Badge bg="secondary" className="text-capitalize">
            {item.mediaType}
          </Badge>
        </div>

        {/* text-break keeps long titles inside the card instead of stretching the layout. */}
        <Card.Title className="h6 text-break">{item.collectionName}</Card.Title>

        <Card.Text className="text-muted small mb-1 text-break">
          {item.artistName}
        </Card.Text>

        <Card.Text className="text-muted small">Released: {releaseYear}</Card.Text>

        <div className="mt-auto d-grid gap-2">
          {item.viewUrl && (
            <Button
              as="a"
              href={item.viewUrl}
              target="_blank"
              rel="noreferrer"
              variant="outline-secondary"
              size="sm"
            >
              View on iTunes
            </Button>
          )}

          {isFavourite ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onRemoveFavourite(item.id)}
            >
              Remove favourite
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onAddFavourite(item)}
            >
              Add favourite
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ResultCard;
