import React from 'react';
import { Navbar, Container} from 'react-bootstrap';

const Header = () => (
  <Navbar bg="dark" variant="dark" expand="lg">
    <Container>
      <Navbar.Brand href="#">TypeSprint</Navbar.Brand>
    </Container>
  </Navbar>
);

export default Header;
