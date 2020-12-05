import React from "react";
import { useStaticQuery, graphql } from "gatsby";
// import Image from "gatsby-image";
import styled from "styled-components";

import { rhythm } from "../utils/typography";

const BioContainer = styled.div`
    display: flex;
    marginbottom: rhythm(1);

    @media (max-width: ${props => props.theme.mobileBreakpoint}px) {
        flex-direction: column;
    }
`;

const Bio = () => {
    const data = useStaticQuery(graphql`
        query BioQuery {
            avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
                childImageSharp {
                    fixed(width: 50, height: 50) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
            site {
                siteMetadata {
                    author
                    social {
                        twitter
                        github
                    }
                }
            }
        }
    `);

    const { author, social } = data.site.siteMetadata;
    return (
        <BioContainer>
            {/* <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                    marginRight: rhythm(1 / 2),
                    marginBottom: 0,
                    minWidth: 50,
                    borderRadius: `100%`,
                }}
                imgStyle={{
                    borderRadius: `50%`,
                }}
            /> */}
            <p>
                I'm Sam Anderson, a software developer based in Sheffield, UK
                specializing in building nice things for nice people.
            </p>
        </BioContainer>
    );
};

export default Bio;
