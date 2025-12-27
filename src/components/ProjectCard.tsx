"use client";

import { AvatarGroup, Carousel, Column, Flex, Heading, SmartLink, Spotlight, Text, } from "@/once-ui/components";

interface ProjectCardProps {
  /** The URL for the "Explore detailed insights" link */
  href: string;
  /** Whether to preload the images */
  preload?: boolean;
  /** Array of image URLs to display in the carousel */
  images?: string[];
  /** Title of the project */
  title: string;
  /** Main content/description text */
  content?: string;
  /** Short description or subtitle */
  description?: string;
  /** List of avatars to display */
  avatars?: { src: string }[];
  /** External link URL */
  link?: string;
}

/**
 * A card component for displaying project details with a carousel, title, description, and links.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars = [],
  link,
  preload = false,
}) => {
  return (
    <Spotlight className="fill-width" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Column fillWidth gap="m" style={{ backdropFilter: 'blur(10px)', background: 'var(--neutral-alpha-weak)', borderRadius: 'var(--radius-l)', padding: 'var(--static-space-16)' }}>
        <Carousel sizes="(max-width: 960px) 100vw, 960px" preload={preload} images={images.map((image) => ({ src: image, alt: title, }))} />
        <Flex mobileDirection="column" fillWidth paddingX="s" paddingTop="12" paddingBottom="24" gap="l"> {title && (<Flex flex={5}><Heading as="h2" wrap="balance" variant="heading-strong-xl">{title}</Heading></Flex>)}
          {(avatars.length > 0 || description?.trim() || content?.trim()) && (
            <Column flex={7} gap="16">
              {avatars.length > 0 && <AvatarGroup avatars={avatars} size="m" reverse />}
              {description?.trim() && (<Text wrap="balance" variant="body-default-s" onBackground="neutral-medium">{description}</Text>)}
              <Flex gap="24" wrap>
                {content?.trim() && (
                  <SmartLink
                    suffixIcon="arrowRight"
                    style={{ margin: "0", width: "fit-content" }}
                    href={href}
                  >
                    <Text variant="body-default-s">Explore detailed insights</Text>
                  </SmartLink>
                )}
                {link && (
                  <SmartLink
                    suffixIcon="arrowUpRightFromSquare"
                    style={{ margin: "0", width: "fit-content" }}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Text variant="body-default-s">View more details</Text>
                  </SmartLink>
                )}
              </Flex>
            </Column>
          )}
        </Flex>
      </Column>
    </Spotlight>
  );
};
