import React from 'react';
import { Avatar, Button, Column, Flex, Heading, Icon, IconButton, SmartLink, SmartImage, Spotlight, Tag, Text, Row } from "@/once-ui/components";
import { ShareButton } from "@/components/ShareButton";
import { baseURL } from "@/app/resources";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import { person, about, social } from "@/app/resources/content";

// Generate metadata for SEO and social sharing
export async function generateMetadata() {
  const title = about.title;
  const description = about.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/about`,
      images: [{
        url: ogImage,
        alt: title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// Define table of contents structure
const structure = [
  {
    title: about.intro.title,
    display: about.intro.display,
    items: [],
  },
  {
    title: about.work.title,
    display: about.work.display,
    items: about.work.experiences.map((experience) => experience.company),
  },
  {
    title: about.studies.title,
    display: about.studies.display,
    items: about.studies.institutions.map((institution) => institution.name),
  },
  {
    title: about.technical.title,
    display: about.technical.display,
    items: about.technical.skills.map((skill) => skill.title),
  },
];

// Schema.org structured data for better SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  description: about.intro.description,
  url: `https://${baseURL}/about`,
  image: `${baseURL}/images/${person.avatar}`,
  sameAs: social
    .filter((item) => item.link && !item.link.startsWith("mailto:"))
    .map((item) => item.link),
  worksFor: {
    "@type": "Organization",
    name: about.work.experiences[0].company || "",
  },
};

export default function About() {
  return (
    <Column maxWidth="m" marginTop="l">
      {/* Hidden H1 for accessibility */}
      <h1 style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        clip: "rect(1px, 1px, 1px, 1px)",
        whiteSpace: "nowrap"
      }}>
        {about.title}
      </h1>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Table of Contents */}
      {/* {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          hide="s"
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )} */}

      <Flex fillWidth mobileDirection="column" horizontal="center">
        {/* Avatar Section */}
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            minWidth="160"
            paddingX="l"
            paddingBottom="m"
            paddingTop="0"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" style={{ border: '3px solid var(--brand-alpha-strong)' }}
            />
            <Flex gap="8" vertical="stretch" horizontal="center">
              Languages
            </Flex>
            {person.languages.length > 0 && (
              <Flex wrap gap="8" horizontal="center">
                {person.languages.map((language, index) => (
                  <Tag key={index} size="l">
                    {language}
                  </Tag>
                ))}
              </Flex>
            )}
          </Column>
        )}

        {/* Main Content */}
        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          {/* Introduction Section */}
          <Column
            id={about.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {about.calendar.display && (
              <SmartLink
                href={about.calendar.link}
                unstyled
                className={styles.blockAlign}
                style={{ textDecoration: 'none' }}
              >
                <Flex
                  fitWidth
                  border="brand-alpha-medium"
                  className={styles.blockAlign}
                  style={{
                    backdropFilter: "blur(var(--static-space-1))",
                    cursor: "pointer"
                  }}
                  background="brand-alpha-weak"
                  radius="full"
                  padding="4"
                  gap="8"
                  marginTop="0"
                  marginBottom="l"
                  vertical="center"
                >
                  <Icon paddingLeft="l" name="calendar" onBackground="brand-weak" />
                  <Flex paddingX="xl" paddingY="xs" align="center">
                    Schedule a call
                  </Flex>
                  <Flex
                    width="32"
                    height="32"
                    center
                    radius="full"
                    border="neutral-medium"
                    background="neutral-alpha-medium"
                    style={{ pointerEvents: "none" }}
                  >
                    <Icon name="chevronRight" size="s" />
                  </Flex>
                </Flex>
              </SmartLink>
            )}

            <Heading className={`${styles.textAlign} ${styles.nameHeading} ${styles.mediumWeight}`} variant="display-default-l">
              {person.name}
            </Heading>

            <Text className={styles.textAlign} variant="display-default-xs" onBackground="neutral-weak">
              {person.role}
            </Text>

            {/* Social Links */}
            {social.length > 0 && (
              <Flex
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
              >
                {social.map((item) => item.link && (
                  <React.Fragment key={item.name}>
                    <Button
                      className="s-flex-hide"
                      href={item.link}
                      prefixIcon={item.icon}
                      label={item.name}
                      size="s"
                      variant="secondary"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.01)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid var(--neutral-border-strong)',
                      }}
                    />
                    <IconButton
                      className="s-flex-show"
                      size="l"
                      href={item.link}
                      icon={item.icon}
                      tooltip={item.name}
                      variant="secondary"
                      style={{
                        backgroundColor: 'var(--neutral-background)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid var(--neutral-border-strong)',
                      }}
                    />
                  </React.Fragment>
                ))}
              </Flex>
            )}
          </Column>

          {/* Introduction Description */}
          {about.intro.display && (
            <Spotlight className="fill-width">
              <Column
                textVariant="body-default-l"
                marginBottom="l"
                padding="16"
                radius="l"
                style={{
                  width: "100%",
                  maxWidth: "900px",
                  backdropFilter: 'blur(10px)',
                  background: 'var(--neutral-alpha-weak)'
                }}
              >
                {about.intro.description}
              </Column>
            </Spotlight>
          )}

          {/* Work Experience Section */}
          {about.work.display && (
            <>
              <Heading className={`${styles.textAlign2} ${styles.nameHeading} ${styles.mediumWeight}`}
                id={about.work.title}
                variant="display-default-s"
                marginBottom="m"
              >
                {about.work.title}
              </Heading>
              <Column fillWidth gap="m" marginBottom="40">
                {about.work.experiences.map((experience, index) => (
                  <Spotlight key={`${experience.company}-${experience.role}-${index}`} className="fill-width">
                    <Column
                      fillWidth
                      padding="16"
                      radius="l"
                      style={{ backdropFilter: 'blur(10px)', background: 'var(--neutral-alpha-weak)' }}
                    >
                      <Flex fillWidth horizontal="space-between" vertical="end" marginBottom="0">
                        <Text id={experience.company} className={`${styles.textAlign2} ${styles.smallWeight}`} variant="body-strong-xl">
                          {experience.company}
                        </Text>
                        <Text variant="heading-strong-xs" onBackground="neutral-weak">
                          {experience.timeframe}
                        </Text>
                      </Flex>
                      <Text variant="body-strong-m" onBackground="brand-weak" marginBottom="m">
                        {experience.role}
                      </Text>
                      <Column as="ul" gap="0" style={{ width: "100%", maxWidth: "900px" }}>
                        {experience.achievements.map((achievement: React.ReactNode, index: number) => (
                          <Text
                            as="li"
                            variant="body-default-m"
                            key={`${experience.company}-${index}`}
                          >
                            {achievement}
                          </Text>
                        ))}
                      </Column>

                      {/* Experience Images */}
                      {experience.images.length > 0 && (
                        <Flex fillWidth paddingTop="m" paddingLeft="40" wrap>
                          {experience.images.map((image, index) => (
                            <Flex
                              key={index}
                              border="neutral-medium"
                              radius="m"
                              //@ts-ignore
                              minWidth={image.width}
                              //@ts-ignore
                              height={image.height}
                            >
                              <SmartImage
                                enlarge
                                radius="m"
                                //@ts-ignore
                                sizes={image.width.toString()}
                                //@ts-ignore
                                alt={image.alt}
                                //@ts-ignore
                                src={image.src}
                              />
                            </Flex>
                          ))}
                        </Flex>
                      )}
                    </Column>
                  </Spotlight>
                ))}
              </Column>
            </>
          )}

          {/* Education Section */}
          {about.studies.display && (
            <>
              <Heading className={`${styles.textAlign2} ${styles.nameHeading} ${styles.mediumWeight}`}
                id={about.studies.title}
                variant="display-default-s"
                marginBottom="m"
              >
                {about.studies.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {about.studies.institutions.map((institution, index) => (
                  <Spotlight key={`${institution.name}-${index}`} className="fill-width">
                    <Column
                      fillWidth
                      gap="4"
                      padding="16"
                      radius="l"
                      style={{ backdropFilter: 'blur(10px)', background: 'var(--neutral-alpha-weak)' }}
                    >
                      <Text id={institution.name} className={`${styles.textAlign2} ${styles.nameHeading} ${styles.smallWeight}`} variant="body-strong-xl">
                        {institution.name}
                      </Text>
                      <Text variant="heading-strong-s" onBackground="neutral-weak">
                        {institution.description}
                      </Text>
                    </Column>
                  </Spotlight>
                ))}
              </Column>
            </>
          )}

          {/* Technical Skills Section */}
          {about.technical.display && (
            <>
              <Heading className={`${styles.textAlign2} ${styles.nameHeading} ${styles.mediumWeight}`}
                id={about.technical.title}
                variant="display-default-s"
                marginBottom="m"
              >
                {about.technical.title}
              </Heading>
              <Column fillWidth gap="l">
                {about.technical.skills.map((skill, index) => (
                  <Spotlight key={`${skill}-${index}`} className="fill-width">
                    <Column
                      fillWidth
                      padding="16"
                      radius="l"
                      style={{ backdropFilter: 'blur(10px)', background: 'var(--neutral-alpha-weak)' }}
                    >
                      <Row gap="24" vertical="center">
                        <Column vertical="center">
                          {/* @ts-ignore */}
                          {skill.icon && <Icon name={skill.icon} size="xl" />}
                        </Column>
                        <Column gap="4">
                          <Text variant="body-default-xl">
                            {skill.title}
                          </Text>
                          <Text variant="body-strong-l" onBackground="neutral-weak">
                            {skill.description}
                          </Text>
                        </Column>
                      </Row>
                      {skill.images && skill.images.length > 0 && (
                        <Flex fillWidth paddingTop="m" gap="12" wrap>
                          {skill.images.map((image, index) => (
                            <Flex
                              key={index}
                              border="neutral-medium"
                              radius="m"
                              //@ts-ignore
                              minWidth={image.width}
                              //@ts-ignore
                              height={image.height}
                            >
                              <SmartImage
                                enlarge
                                radius="m"
                                //@ts-ignore
                                sizes={image.width.toString()}
                                //@ts-ignore
                                alt={image.alt}
                                //@ts-ignore
                                src={image.src}
                              />
                            </Flex>
                          ))}
                        </Flex>
                      )}
                    </Column>
                  </Spotlight>
                ))}
              </Column>
            </>
          )}

          <Row gap="16" vertical="center" horizontal="center" marginTop="32">
            <ShareButton
              title={about.title}
              url={`https://${baseURL}/about`}
              text="Share via Link"
            />
          </Row>
        </Column>
      </Flex>
    </Column>
  );
}