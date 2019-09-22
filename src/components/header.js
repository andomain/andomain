import React from "react"
import { Link } from "gatsby"
import styled from 'styled-components';
import { rhythm, scale } from "../utils/typography"

const HeaderContainer = styled.header`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: ${rhythm(1.5)};
`;

const LinkContainer = styled.nav`
    flex: 1;
    display: flex;
    justify-content: flex-end;
    margin: 0 ${rhythm(.5)};
    list-style: none;

    a {
        display: flex;
        align-items: center;
        margin: 0 ${rhythm(.5)} 0 0;
    }

    @media(max-width: ${props => props.theme.mobileBreakpoint}px) {
        justify-content: space-around;

        a {
            margin: 0;
        }
    }
`;

const Header = ({ title }) => {
    return (
        <HeaderContainer>
            <h1 style={{ ...scale(1.5) }}>
                <Link
                    style={{
                        boxShadow: `none`,
                        textDecoration: `none`,
                        color: `inherit`,
                    }}
                    to={`/`}
                >
                    {title}
                </Link>
            </h1>
            <LinkContainer>
                <Link to={`/`}>Blog</Link>
                <Link to={`/contact`}>Contact</Link>
                <Link to={`/resume`}>Resume</Link>
            </LinkContainer>
        </HeaderContainer>
    );
}

export default Header;
