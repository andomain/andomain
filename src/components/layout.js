import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import styled, { ThemeProvider } from "styled-components";

import Header from "./header";
import SEO from "./seo";

import { rhythm } from "../utils/typography";
import "../styles/global.scss";

const PageContainer = styled.div`
    margin: 0 auto;
    width: 100%;
    max-width: ${rhythm(24)};
    padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
`;

const theme = {
    main: "#252525",
    highlight: "#ff0000",
    link: "#af0404",
    neutral: "#414141",
    light: "#eee",
    mobileBreakpoint: 768,
};

const Layout = ({ children, pageTitle }) => {
    const { site } = useStaticQuery(
        graphql`
            query {
                site {
                    siteMetadata {
                        title
                        description
                        author
                    }
                }
            }
        `
    );

    return (
        <ThemeProvider theme={theme}>
            <>
                <SEO pageTitle={pageTitle} {...site.siteMetadata} />
                <PageContainer>
                    <Header title={site.siteMetadata.title} />
                    <main>{children}</main>
                    <footer>
                        © {new Date().getFullYear()}, Built with
                        {` `}
                        <a href="https://www.gatsbyjs.org">Gatsby</a>
                    </footer>
                </PageContainer>
            </>
        </ThemeProvider>
    );
};

export default Layout;
