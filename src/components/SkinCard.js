import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './SkinCard.css';
export default function SkinCard({skin,onSelect}) {
  return (
    <div className="card1">
      <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="https://cdn.arstechnica.net/wp-content/uploads/2020/04/valorant-listing-800x450.jpg" />
      <Card.Body>
        <Card.Title>{skin.name}</Card.Title>
        <Card.Text>
          {skin.desc}
        </Card.Text>
        <Button variant="secondary">See Details</Button>
      </Card.Body>
    </Card>
    </div>
    
  );
}
