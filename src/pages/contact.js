import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

class Contact extends React.Component {
    render() {
        return (
            <Layout pageTitle="Contact">
                <p>
                    I'm on twitter{" "}
                    <a href="https://twitter.com/andomain">@andomain</a>
                </p>

                <p>
                    Or if you need more than{" "}
                    <span class="strikethrough">140</span> 280 characters{" "}
                    <a href="mailto:sam@andomain.co.uk">drop me an email</a>
                </p>
            </Layout>
        );
    }
}

export default Contact;
