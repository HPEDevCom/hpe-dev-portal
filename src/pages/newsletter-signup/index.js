import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Tab, Tabs, Heading } from 'grommet';
import {
  Layout,
  SEO,
  PageDescription,
  OpenSourceCard,
  ResponsiveGrid,
} from '../../components';
import { EmailCapture } from '../../containers';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

const columns = {
  small: ['auto'],
  medium: ['auto', 'auto'],
  large: ['auto', 'auto'],
  xlarge: ['auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

function NewsletterSignup({ data }) {
  const newsletters = data.allMarkdownRemark.group.sort((a, b) =>
    a.fieldValue < b.fieldValue ? 1 : -1,
  );
  const [index, setIndex] = useState(0);
  const onActive = (nextIndex) => setIndex(nextIndex);
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <SEO title="Newsletter-Signup" />
      <Box flex overflow="auto" gap="large" pad="xlarge" wrap>
        <PageDescription image="/img/newsletter/NewsletterPage.svg" title="">
          <EmailCapture
            heading="Newsletter"
            bodyCopy1="Subscribe to our HPE Developer Newsletter to stay up-to-date on the 
            newest HPE Dev Community activities, posts, and tutorials."
          />
        </PageDescription>
        <Box margin={{ top: 'large' }}>
          <Heading margin="none" level="2">
            Newsletter Archive
          </Heading>
          <Tabs activeIndex={index} onActive={onActive} justify="start">
            {newsletters.map((newsletter, i) => (
              <Tab key={i} title={newsletter.fieldValue}>
                <ResponsiveGrid
                  margin={{ top: 'small' }}
                  gap="large"
                  rows={rows}
                  columns={columns}
                >
                  {newsletter.edges.map(({ node }) => (
                    <OpenSourceCard
                      key={node.id}
                      title={node.frontmatter.title}
                      description={node.frontmatter.description}
                      link={node.frontmatter.link}
                      stars={false}
                      date={node.frontmatter.date}
                      monthly={node.frontmatter.monthly}
                      newsletter
                    />
                  ))}
                </ResponsiveGrid>
              </Tab>
            ))}
          </Tabs>
        </Box>
      </Box>
    </Layout>
  );
}

NewsletterSignup.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string,
          totalcount: PropTypes.number,
          edges: PropTypes.arrayOf(
            PropTypes.shape({
              node: PropTypes.shape({
                frontmatter: PropTypes.shape({
                  title: PropTypes.string.isRequired,
                }).isRequired,
                excerpt: PropTypes.string.isRequired,
                fields: PropTypes.shape({
                  slug: PropTypes.string.isRequired,
                  sourceInstanceName: PropTypes.string.isRequired,
                }),
              }).isRequired,
            }).isRequired,
          ).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default NewsletterSignup;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "newsletter" } } }
      sort: { fields: [frontmatter___date], order: ASC }
    ) {
      group(field: fields___year) {
        fieldValue
        totalCount
        edges {
          node {
            id
            rawMarkdownBody
            fields {
              slug
              sourceInstanceName
              year
            }
            excerpt
            frontmatter {
              title
              date
              description
              link
              monthly
            }
          }
        }
      }
    }
  }
`;
