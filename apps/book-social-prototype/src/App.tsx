import { useMemo, useState, type ChangeEvent, type CSSProperties, type ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import {
  AppHeader,
  Avatar,
  Banner,
  BottomNav,
  Button,
  ChoiceChip,
  FabButton,
  GridCard,
  GridWidget,
  Icon,
  Ratings,
  SearchBar,
  SectionHeader,
  StaticSliderCard,
  StaticSliderWidget,
  Text,
  getRequiredThemeTokenValue
} from "@turbo/web";

type ScreenId = "explore" | "search" | "detail" | "library" | "feed" | "profile";
type ExploreMode = "discover" | "personalized";
type SearchScope = "Books" | "Authors";
type FeedMode = "cards" | "compact";
type BrandOption = DisplayBrandId;

type BookRecord = {
  author: string;
  blurb: string;
  coverAccent: string;
  coverTone: string;
  rating: number;
  reviews: string;
  shelf: string;
  title: string;
};

const BRANDS: BrandOption[] = ["Cars24", "Team BHP", "CarInfo", "VehicleInfo"];

const TRENDING_KEYWORDS = ["Fantasy", "Mystery", "Romance", "Mindset"];
const TOP_GENRES = ["Fantasy", "Thriller", "Memoir", "Sci-Fi"];
const AUTHOR_FILTERS = ["Wizard stories", "Modern essays", "Founder memoirs"];

const BOOKS: BookRecord[] = [
  {
    author: "Harriet Winters",
    blurb: "A magical boarding-school saga with warm friendships, hidden chambers, and midnight clues.",
    coverAccent: "#F59E0B",
    coverTone: "#7C2D12",
    rating: 4.5,
    reviews: "473 reviews",
    shelf: "Recommended this week",
    title: "Harry Potter and the Ember Archive"
  },
  {
    author: "Mina Sol",
    blurb: "A quiet sci-fi novel about memory, migration, and rebuilding a life among the stars.",
    coverAccent: "#60A5FA",
    coverTone: "#1E3A8A",
    rating: 4.7,
    reviews: "208 reviews",
    shelf: "Popular books",
    title: "Blue Orbit House"
  },
  {
    author: "R. K. Linton",
    blurb: "A founder memoir with tactical chapters on team culture, conviction, and staying useful under pressure.",
    coverAccent: "#34D399",
    coverTone: "#064E3B",
    rating: 4.2,
    reviews: "121 reviews",
    shelf: "My Booklist",
    title: "Building Quietly"
  }
];

const FEED_POSTS = [
  {
    author: "Nina",
    body: "Finished Blue Orbit House. The last 50 pages are all atmosphere and payoff.",
    tag: "Review",
    title: "Tonight's read"
  },
  {
    author: "Harsh",
    body: "Starting a fantasy thread: best magical-school book that still feels adult?",
    tag: "Discussion",
    title: "Looking for recs"
  },
  {
    author: "Mira",
    body: "Library loan reminder saved me again. Borrowed copy ready for pickup tomorrow.",
    tag: "Update",
    title: "Borrow win"
  }
];

const PRIMARY_BOOK = BOOKS[0]!;
const SECONDARY_BOOK = BOOKS[1]!;
const TERTIARY_BOOK = BOOKS[2]!;
const RECENT_BOOKS: BookRecord[] = [PRIMARY_BOOK, SECONDARY_BOOK, TERTIARY_BOOK];

export function App() {
  const [brand, setBrand] = useState<BrandOption>("Cars24");
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [screen, setScreen] = useState<ScreenId>("explore");
  const [exploreMode, setExploreMode] = useState<ExploreMode>("discover");
  const [searchQuery, setSearchQuery] = useState("Harry");
  const [searchScope, setSearchScope] = useState<SearchScope>("Books");
  const [feedMode, setFeedMode] = useState<FeedMode>("cards");
  const [selectedBook, setSelectedBook] = useState<BookRecord>(PRIMARY_BOOK);

  const shell = useMemo(() => createShellStyles(brand), [brand]);
  const navValue = screen === "detail" || screen === "search" ? "explore" : screen;

  const openBook = (book: BookRecord) => {
    setSelectedBook(book);
    setScreen("detail");
  };

  return (
    <div data-brand={brand} style={shell.page}>
      <div aria-hidden="true" style={shell.ambientGlow} />

      <div style={shell.layout}>
        <aside style={shell.desktopRail}>
          <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
            Prototype flow
          </Text>
          <Text as="strong" brand={brand} size="xl" style={{ display: "block", margin: 0 }}>
            Social reading app wired from your sketch
          </Text>
          <Text as="p" brand={brand} size="md" tone="secondary" style={{ margin: 0 }}>
            Explore, search, detail, library, feed, and profile are all connected so the wireframe behaves like a product walkthrough.
          </Text>

          <div style={shell.flowList}>
            {[
              ["Explore", "Search-led home with recommendation shelves and genre chips."],
              ["Search", "Typed query state with book and author results."],
              ["Book detail", "Rating, intro, author block, and clear borrow action."],
              ["My books", "Recently read, booklist, and reading report modules."],
              ["Feed", "Two feed densities based on your sketch variants."],
              ["Profile", "A calmer personal home screen with reading stats."]
            ].map(([title, body]) => (
              <div key={title} style={shell.flowCard}>
                <Text as="strong" brand={brand} size="sm" style={{ margin: 0 }}>
                  {title}
                </Text>
                <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
                  {body}
                </Text>
              </div>
            ))}
          </div>
        </aside>

        <div style={shell.phoneWrap}>
          <div style={shell.phone}>
            <div style={shell.phoneInner}>
              {screen === "explore" ? (
                <ExploreScreen
                  brand={brand}
                  exploreMode={exploreMode}
                  onModeChange={setExploreMode}
                  onOpenBook={openBook}
                  onOpenSearch={() => setScreen("search")}
                />
              ) : null}

              {screen === "search" ? (
                <SearchScreen
                  brand={brand}
                  query={searchQuery}
                  scope={searchScope}
                  onBack={() => setScreen("explore")}
                  onOpenBook={openBook}
                  onQueryChange={setSearchQuery}
                  onScopeChange={setSearchScope}
                />
              ) : null}

              {screen === "detail" ? (
                <DetailScreen
                  brand={brand}
                  book={selectedBook}
                  onBack={() => setScreen("search")}
                />
              ) : null}

              {screen === "library" ? <LibraryScreen brand={brand} onOpenBook={openBook} /> : null}
              {screen === "feed" ? <FeedScreen brand={brand} mode={feedMode} onModeChange={setFeedMode} /> : null}
              {screen === "profile" ? <ProfileScreen brand={brand} onOpenBook={openBook} /> : null}
            </div>

            <div style={shell.bottomNavWrap}>
              <BottomNav
                brand={brand}
                configuration="Label + icon"
                items={[
                  { ariaLabel: "Explore", iconName: "magnifying-glass-outline", label: "Explore", value: "explore" },
                  { ariaLabel: "Library", iconName: "book-open-outline", label: "My books", value: "library" },
                  { ariaLabel: "Feed", iconName: "sparkle-line", label: "Feed", value: "feed" },
                  { ariaLabel: "Profile", iconName: "people-circle-user-circle-avatar-profile-outline", label: "Me", value: "profile" }
                ]}
                style={{ width: "100%" }}
                type="Sticky"
                value={navValue}
                onValueChange={(value: string) => setScreen(value as ScreenId)}
              />
            </div>
          </div>

          <div style={shell.overlayArea}>
            <div style={shell.brandFab}>
              <FabButton
                aria-label="Switch brand"
                brand={brand}
                icon={<Icon decorative name="sparkle-filled" />}
                onClick={() => setBrandMenuOpen((open) => !open)}
                showTag={false}
                tagLabel=""
              >
                Brand
              </FabButton>
            </div>

            {brandMenuOpen ? (
              <div style={shell.brandMenu}>
                <SectionHeader
                  brand={brand}
                  description="Swap the token system live across the whole prototype."
                  showAction={false}
                  showTag={false}
                  title="Switch brand"
                />
                <div style={shell.brandMenuList}>
                  {BRANDS.map((option) => (
                    <button
                      key={option}
                      style={{
                        ...shell.brandMenuItem,
                        ...(option === brand ? shell.brandMenuItemActive : {})
                      }}
                      type="button"
                      onClick={() => {
                        setBrand(option);
                        setBrandMenuOpen(false);
                      }}
                    >
                      <span>{option}</span>
                      {option === brand ? <Icon decorative name="check-outline" /> : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExploreScreen({
  brand,
  exploreMode,
  onModeChange,
  onOpenBook,
  onOpenSearch
}: {
  brand: DisplayBrandId;
  exploreMode: ExploreMode;
  onModeChange: (mode: ExploreMode) => void;
  onOpenBook: (book: BookRecord) => void;
  onOpenSearch: () => void;
}) {
  return (
    <ScreenScaffold
      brand={brand}
      header={
        <AppHeader
          actions={[{ icon: <Icon decorative name="bell-outline" />, label: "Notifications" }]}
          brand={brand}
          level="Page - L2"
          showAvatar
          subtitle="Find your next page-turner"
          title="Bookverse"
          variant="Light"
        />
      }
    >
      <SectionBlock>
        <div aria-hidden="true" role="presentation" style={{ cursor: "pointer" }} onClick={onOpenSearch}>
          <SearchBar brand={brand} color="Solid White" placeholder="Search books, authors, or shelves" readOnly size="Large" />
        </div>
      </SectionBlock>

      <SectionBlock>
        <ChipRow>
          <ChoiceChip brand={brand} label="Discover" size="Small" state={exploreMode === "discover" ? "Active" : "Rest"} variant="Horizontal" onClick={() => onModeChange("discover")} />
          <ChoiceChip brand={brand} label="For you" size="Small" state={exploreMode === "personalized" ? "Active" : "Rest"} variant="Horizontal" onClick={() => onModeChange("personalized")} />
          <ChoiceChip brand={brand} label="Scan book" size="Small" state="Rest" variant="Horizontal" />
        </ChipRow>
      </SectionBlock>

      {exploreMode === "discover" ? (
        <>
          <StaticSliderWidget
            brand={brand}
            description="Mood-based picks built from the keywords in your wireframe."
            headerActionLabel="View all"
            showCta={false}
            showHeaderAction
            showTag={false}
            showTabSlider={false}
            subtitle=""
            title="Recommend this week"
          >
            <SliderRail>
              {RECENT_BOOKS.map((book) => (
                <button key={book.title} style={sliderButtonReset} type="button" onClick={() => onOpenBook(book)}>
                  <StaticSliderCard
                    brand={brand}
                    columnCount="1+"
                    description={book.author}
                    size="Medium"
                    tagLabel=""
                    title={book.title}
                    type="Text Outside"
                  >
                    <HeroCover book={book} brand={brand} />
                  </StaticSliderCard>
                </button>
              ))}
            </SliderRail>
          </StaticSliderWidget>

          <GridWidget
            brand={brand}
            description="Fast entry points for browsing."
            headerActionLabel="Explore all"
            primaryAction={null}
            showHeaderAction={false}
            showTag={false}
            subtitle=""
            title="Top genres"
          >
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", width: "100%" }}>
              {TOP_GENRES.map((genre) => (
                <GridCard
                  key={genre}
                  brand={brand}
                  columnCount="2 Column"
                  description=""
                  size="Medium"
                  tagLabel=""
                  title={genre}
                  type="Text Outside"
                />
              ))}
            </div>
          </GridWidget>

          <ContentSection brand={brand} title="Authors you like" description="Continue from writers you already follow.">
            <AuthorRow brand={brand} />
          </ContentSection>
        </>
      ) : (
        <>
          <ContentSection brand={brand} title="Authors you like" description="A personalized explore state with people-first discovery.">
            <AuthorRow brand={brand} />
          </ContentSection>

          <StaticSliderWidget
            brand={brand}
            description="Popular covers still stay visual and quick to scan."
            headerActionLabel="View all"
            showCta={false}
            showHeaderAction
            showTag={false}
            showTabSlider={false}
            subtitle=""
            title="Popular books"
          >
            <SliderRail>
              {RECENT_BOOKS.map((book) => (
                <button key={book.title} style={sliderButtonReset} type="button" onClick={() => onOpenBook(book)}>
                  <StaticSliderCard
                    brand={brand}
                    columnCount="1+"
                    description={book.author}
                    size="Medium"
                    tagLabel=""
                    title={book.title}
                    type="Text Outside"
                  >
                    <HeroCover book={book} brand={brand} />
                  </StaticSliderCard>
                </button>
              ))}
            </SliderRail>
          </StaticSliderWidget>

          <ContentSection brand={brand} title="Top quotes" description="A small social texture that keeps the home screen alive.">
            <Banner brand={brand} description="“A reader lives a thousand lives before he dies.”" heading action={false} state="Info" />
          </ContentSection>
        </>
      )}

      <SectionBlock>
        <SectionHeader
          brand={brand}
          description="Keywords of user"
          showAction={false}
          showTag={false}
          title="Quick topics"
        />
        <ChipRow>
          {TRENDING_KEYWORDS.map((tag, index) => (
            <ChoiceChip
              key={tag}
              brand={brand}
              label={tag}
              size="Small"
              state={index === 0 ? "Active" : "Rest"}
              variant="Horizontal"
            />
          ))}
        </ChipRow>
      </SectionBlock>
    </ScreenScaffold>
  );
}

function SearchScreen({
  brand,
  onBack,
  onOpenBook,
  onQueryChange,
  onScopeChange,
  query,
  scope
}: {
  brand: DisplayBrandId;
  onBack: () => void;
  onOpenBook: (book: BookRecord) => void;
  onQueryChange: (value: string) => void;
  onScopeChange: (value: SearchScope) => void;
  query: string;
  scope: SearchScope;
}) {
  return (
    <ScreenScaffold
      brand={brand}
      header={
        <div style={{ padding: "12px 16px 0" }}>
          <SearchBar
            brand={brand}
            color="Solid White"
            placeholder="Input hint"
            showBackButton
            showClearButton
            size="Large"
            value={query}
            onBackClick={onBack}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onQueryChange(event.currentTarget.value)}
            onClearClick={() => onQueryChange("")}
          />
        </div>
      }
    >
      <SectionBlock>
        <ChipRow>
          <ChoiceChip brand={brand} label="Books" size="Small" state={scope === "Books" ? "Active" : "Rest"} variant="Horizontal" onClick={() => onScopeChange("Books")} />
          <ChoiceChip brand={brand} label="Authors" size="Small" state={scope === "Authors" ? "Active" : "Rest"} variant="Horizontal" onClick={() => onScopeChange("Authors")} />
          <ChoiceChip brand={brand} label="Scan book" size="Small" state="Rest" variant="Horizontal" />
        </ChipRow>
      </SectionBlock>

      {scope === "Books" ? (
        <ContentSection brand={brand} title="Books" description="Search results aligned to the typed state in your wireframe.">
          <ResultList>
            {BOOKS.map((book) => (
              <ResultRow key={book.title} brand={brand} body={book.author} title={book.title} onClick={() => onOpenBook(book)} />
            ))}
          </ResultList>
        </ContentSection>
      ) : (
        <ContentSection brand={brand} title="Author" description="People and themes that match the query.">
          <ResultList>
            {AUTHOR_FILTERS.map((filter) => (
              <ResultRow key={filter} brand={brand} body="12 matching books" title={filter} />
            ))}
          </ResultList>
        </ContentSection>
      )}
    </ScreenScaffold>
  );
}

function DetailScreen({
  book,
  brand,
  onBack
}: {
  book: BookRecord;
  brand: DisplayBrandId;
  onBack: () => void;
}) {
  const metricColor = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));

  return (
    <ScreenScaffold
      brand={brand}
      header={
        <AppHeader
          actions={[{ icon: <Icon decorative name="heart-like-outline" />, label: "Save book" }]}
          brand={brand}
          level="Page - L2"
          pillAction={{ label: "Back", onClick: onBack }}
          showAvatar={false}
          showSubtitle={false}
          title="Book details"
          variant="Light"
        />
      }
    >
      <SectionBlock>
        <HeroCover book={book} brand={brand} large />
      </SectionBlock>

      <SectionBlock>
        <Text as="strong" brand={brand} size="lg" style={{ display: "block", margin: 0 }}>
          {book.title}
        </Text>
        <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: "4px 0 0" }}>
          {book.author}
        </Text>

        <div style={{ alignItems: "center", display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", marginTop: 16 }}>
          <MetricBlock brand={brand} label="Rating" value="4.5" />
          <MetricBlock brand={brand} label="Borrowed" value="1,000" />
          <MetricBlock brand={brand} label="Reviews" value="473" />
        </div>

        <div style={{ marginTop: 12 }}>
          <Ratings brand={brand} rating={book.rating} />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Button brand={brand} shape="Pill" size="Large" styleVariant="Outline">
            Chant
          </Button>
          <Button brand={brand} shape="Pill" size="Large">
            Read
          </Button>
        </div>
      </SectionBlock>

      <ContentSection brand={brand} title="Intro" description={book.blurb}>
        <Banner brand={brand} action={false} description="Borrow digitally, track progress, and join a discussion thread from one place." heading={false} state="Info" />
      </ContentSection>

      <ContentSection brand={brand} title="About author" description="A short author snapshot keeps the detail screen useful, not crowded.">
        <div style={{ alignItems: "center", display: "grid", gap: 12, gridTemplateColumns: "auto 1fr" }}>
          <Avatar appearance="Initials" adornment="None" brand={brand} initials="HW" size="Extra large" />
          <div>
            <Text as="strong" brand={brand} size="sm" style={{ margin: 0 }}>
              {book.author}
            </Text>
            <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: "4px 0 0", color: metricColor }}>
              Writes immersive fantasy with warm ensemble casts and satisfying reveals.
            </Text>
          </div>
        </div>
      </ContentSection>
    </ScreenScaffold>
  );
}

function LibraryScreen({
  brand,
  onOpenBook
}: {
  brand: DisplayBrandId;
  onOpenBook: (book: BookRecord) => void;
}) {
  return (
    <ScreenScaffold
      brand={brand}
      header={
        <AppHeader
          actions={[{ icon: <Icon decorative name="book-outline" />, label: "Saved items" }]}
          brand={brand}
          level="Page - L2"
          showAvatar
          subtitle="Recently read and borrowed"
          title="My books"
          variant="Light"
        />
      }
    >
      <ContentSection brand={brand} title="Recently" description="Keep the first module visual and fast to scan.">
        <HorizontalCards>
          {RECENT_BOOKS.map((book) => (
            <BookCard key={book.title} book={book} brand={brand} compact onClick={() => onOpenBook(book)} />
          ))}
        </HorizontalCards>
      </ContentSection>

      <ContentSection brand={brand} title="My booklist" description="A quieter shelf with add-state behavior.">
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <BookCard book={TERTIARY_BOOK} brand={brand} compact onClick={() => onOpenBook(TERTIARY_BOOK)} />
          <button style={addCardStyles(brand)} type="button">
            <Icon decorative name="circle-plus-add-filled" />
            <Text as="span" brand={brand} size="sm">
              Add title
            </Text>
          </button>
        </div>
      </ContentSection>

      <ContentSection brand={brand} title="Report" description="A friendly reading report rather than a heavy analytics block.">
        <ReadingReport brand={brand} />
      </ContentSection>
    </ScreenScaffold>
  );
}

function FeedScreen({
  brand,
  mode,
  onModeChange
}: {
  brand: DisplayBrandId;
  mode: FeedMode;
  onModeChange: (mode: FeedMode) => void;
}) {
  return (
    <ScreenScaffold
      brand={brand}
      header={
        <AppHeader
          actions={[{ icon: <Icon decorative name="bell-outline" />, label: "Notifications" }]}
          brand={brand}
          level="Page - L2"
          showAvatar
          subtitle="People and posts you follow"
          title="News following"
          variant="Light"
        />
      }
    >
      <SectionBlock>
        <button style={plainButtonStyles} type="button">
          <SearchBar brand={brand} color="Solid White" placeholder="Search posts or readers" readOnly size="Large" />
        </button>
        <ChipRow>
          <ChoiceChip brand={brand} label="Cards" size="Small" state={mode === "cards" ? "Active" : "Rest"} variant="Horizontal" onClick={() => onModeChange("cards")} />
          <ChoiceChip brand={brand} label="Compact" size="Small" state={mode === "compact" ? "Active" : "Rest"} variant="Horizontal" onClick={() => onModeChange("compact")} />
        </ChipRow>
      </SectionBlock>

      <div style={{ display: "grid", gap: 12, padding: "0 16px 20px" }}>
        {FEED_POSTS.map((post, index) => (
          <FeedCard key={post.title} author={post.author} body={post.body} brand={brand} compact={mode === "compact"} title={post.title} removable={index % 2 === 0} />
        ))}
      </div>
    </ScreenScaffold>
  );
}

function ProfileScreen({
  brand,
  onOpenBook
}: {
  brand: DisplayBrandId;
  onOpenBook: (book: BookRecord) => void;
}) {
  return (
    <ScreenScaffold
      brand={brand}
      header={
        <AppHeader
          actions={[{ icon: <Icon decorative name="settings-gear-line" />, label: "Settings" }]}
          brand={brand}
          level="Page - L2"
          showAvatar={false}
          subtitle="Reader profile and activity"
          title="Personal home"
          variant="Light"
        />
      }
    >
      <div style={{ display: "grid", gap: 16, padding: "16px" }}>
        <div style={profileHeroStyles(brand)}>
          <Avatar appearance="Initials" adornment="None" brand={brand} initials="AR" size="Extra large" />
          <div style={{ textAlign: "center" }}>
            <Text as="strong" brand={brand} size="md" style={{ display: "block", margin: 0 }}>
              Aanya Rao
            </Text>
            <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: "4px 0 0" }}>
              Fantasy reader, club host, and note-taker
            </Text>
          </div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", width: "100%" }}>
            <MetricBlock brand={brand} label="Books" value="124" />
            <MetricBlock brand={brand} label="Notes" value="89" />
          </div>
        </div>

        <FeedCard
          author="Current read"
          body="Blue Orbit House is at 68%. Discussion reminder set for Sunday evening."
          brand={brand}
          title="Reading now"
        />

        <FeedCard
          author="Wishlist"
          body="Borrow Building Quietly next, then return to the fantasy shelf."
          brand={brand}
          title="Next up"
          onClick={() => onOpenBook(TERTIARY_BOOK)}
        />
      </div>
    </ScreenScaffold>
  );
}

function ScreenScaffold({
  brand,
  children,
  header
}: {
  brand: DisplayBrandId;
  children: ReactNode;
  header: ReactNode;
}) {
  const background = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));

  return (
    <div style={{ background, display: "grid", minHeight: "100%", paddingBottom: 110 }}>
      <div>{header}</div>
      <div>{children}</div>
    </div>
  );
}

function ContentSection({
  brand,
  children,
  description,
  title
}: {
  brand: DisplayBrandId;
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <SectionBlock>
      <SectionHeader
        brand={brand}
        description={description}
        showAction={false}
        showSubtitle={false}
        showTag={false}
        subtitle=""
        title={title}
      />
      {children}
    </SectionBlock>
  );
}

function SectionBlock({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gap: 12, padding: "16px" }}>{children}</div>;
}

function ChipRow({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>;
}

function HorizontalCards({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gap: 12, gridAutoColumns: "minmax(152px, 1fr)", gridAutoFlow: "column", overflowX: "auto", paddingBottom: 4 }}>{children}</div>;
}

function SliderRail({
  children,
  style,
  viewportPadding
}: {
  children: ReactNode;
  style?: CSSProperties;
  viewportPadding?: string | number;
}) {
  return <div style={{ ...sliderRailStyles, ...style }}>{children}</div>;
}

function BookCard({
  book,
  brand,
  compact = false,
  onClick
}: {
  book: BookRecord;
  brand: DisplayBrandId;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <button style={bookCardStyles(brand, compact)} type="button" onClick={onClick}>
      <HeroCover book={book} brand={brand} />
      <div style={{ display: "grid", gap: 4, textAlign: "left" }}>
        <Text as="strong" brand={brand} size="sm" style={{ margin: 0 }}>
          {book.title}
        </Text>
        <Text as="span" brand={brand} size="sm" tone="secondary">
          {book.author}
        </Text>
      </div>
    </button>
  );
}

function HeroCover({
  book,
  brand,
  large = false
}: {
  book: BookRecord;
  brand: DisplayBrandId;
  large?: boolean;
}) {
  const shadow = "0 20px 48px rgba(15, 23, 42, 0.18)";

  return (
    <div
      style={{
        alignItems: "flex-end",
        background: `linear-gradient(145deg, ${book.coverAccent} 0%, ${book.coverTone} 100%)`,
        borderRadius: large ? 28 : 22,
        boxShadow: shadow,
        display: "flex",
        minHeight: large ? 280 : 170,
        overflow: "hidden",
        padding: large ? 24 : 16,
        position: "relative"
      }}
    >
      <div
        aria-hidden="true"
        style={{
          background: "rgba(255,255,255,0.18)",
          borderRadius: "50%",
          height: large ? 180 : 110,
          position: "absolute",
          right: large ? -24 : -12,
          top: large ? -28 : -18,
          width: large ? 180 : 110
        }}
      />
      <div style={{ color: "#FFFFFF", display: "grid", gap: 8, position: "relative" }}>
        <Text as="span" brand={brand} size="sm" tone="inverse">
          {book.shelf}
        </Text>
        <Text as="strong" brand={brand} size={large ? "xl" : "md"} tone="inverse" style={{ margin: 0 }}>
          {book.title}
        </Text>
      </div>
    </div>
  );
}

function AuthorRow({ brand }: { brand: DisplayBrandId }) {
  return (
    <div style={{ display: "grid", gap: 16, gridAutoColumns: "84px", gridAutoFlow: "column", overflowX: "auto" }}>
      {["HW", "MS", "RK", "AN"].map((initials) => (
        <div key={initials} style={{ display: "grid", gap: 8, justifyItems: "center" }}>
          <Avatar appearance="Initials" adornment="None" brand={brand} initials={initials} size="Extra large" />
          <Text as="span" brand={brand} size="sm" tone="secondary">
            {initials}
          </Text>
        </div>
      ))}
    </div>
  );
}

function ResultList({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gap: 10 }}>{children}</div>;
}

function ResultRow({
  body,
  brand,
  onClick,
  title
}: {
  body: string;
  brand: DisplayBrandId;
  onClick?: () => void;
  title: string;
}) {
  return (
    <button style={resultRowStyles(brand)} type="button" onClick={onClick}>
      <div style={{ display: "grid", gap: 4, textAlign: "left" }}>
        <Text as="strong" brand={brand} size="sm" style={{ margin: 0 }}>
          {title}
        </Text>
        <Text as="span" brand={brand} size="sm" tone="secondary">
          {body}
        </Text>
      </div>
      <Icon decorative name="chevron-small-right-filled" />
    </button>
  );
}

function MetricBlock({
  brand,
  label,
  value
}: {
  brand: DisplayBrandId;
  label: string;
  value: string;
}) {
  return (
    <div style={metricBlockStyles(brand)}>
      <Text as="strong" brand={brand} size="md" style={{ margin: 0 }}>
        {value}
      </Text>
      <Text as="span" brand={brand} size="sm" tone="secondary">
        {label}
      </Text>
    </div>
  );
}

function ReadingReport({ brand }: { brand: DisplayBrandId }) {
  const brandColor = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const muted = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));

  return (
    <div style={reportCardStyles(brand)}>
      <div style={{ alignItems: "end", display: "grid", gap: 8, gridTemplateColumns: "repeat(7, minmax(0, 1fr))", minHeight: 132 }}>
        {[42, 58, 68, 46, 72, 92, 61].map((height, index) => (
          <div
            key={height}
            style={{
              background: index === 5 ? brandColor : muted,
              borderRadius: 999,
              height,
              width: "100%"
            }}
          />
        ))}
      </div>
      <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
        You read 312 pages this week and finished 2 books.
      </Text>
    </div>
  );
}

function FeedCard({
  author,
  body,
  brand,
  compact = false,
  onClick,
  removable = false,
  title
}: {
  author: string;
  body: string;
  brand: DisplayBrandId;
  compact?: boolean;
  onClick?: () => void;
  removable?: boolean;
  title: string;
}) {
  return (
    <button style={feedCardStyles(brand, compact)} type="button" onClick={onClick}>
      <div style={{ alignItems: compact ? "center" : "start", display: "grid", gap: 12, gridTemplateColumns: compact ? "auto 1fr auto" : "auto 1fr" }}>
        <Avatar appearance="Initials" adornment="None" brand={brand} initials={author.slice(0, 2).toUpperCase()} size={compact ? "Medium" : "Large"} />
        <div style={{ display: "grid", gap: 4, textAlign: "left" }}>
          <Text as="strong" brand={brand} size="sm" style={{ margin: 0 }}>
            {title}
          </Text>
          <Text as="span" brand={brand} size="sm" tone="secondary">
            {author}
          </Text>
          <Text as="p" brand={brand} size="sm" style={{ margin: 0 }}>
            {body}
          </Text>
        </div>
        {compact ? <Icon decorative name="close-line" /> : null}
      </div>
      {removable && !compact ? (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Icon decorative name="close-line" />
        </div>
      ) : null}
    </button>
  );
}

function createShellStyles(brand: DisplayBrandId) {
  const pageSurface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const panelSurface = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  const borderColor = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const brandColor = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const textPrimary = String(getRequiredThemeTokenValue(brand, "color.text.primary"));

  return {
    ambientGlow: {
      background: `radial-gradient(circle at top, ${brandColor}22 0%, transparent 55%)`,
      inset: 0,
      pointerEvents: "none" as const,
      position: "fixed" as const
    },
    bottomNavWrap: {
      bottom: 0,
      left: 0,
      padding: "0 12px 12px",
      position: "absolute" as const,
      right: 0
    },
    brandFab: {
      bottom: 0,
      position: "absolute" as const,
      right: 0
    },
    brandMenu: {
      background: pageSurface,
      border: `1px solid ${borderColor}`,
      borderRadius: 24,
      bottom: 72,
      boxShadow: "0 24px 72px rgba(15, 23, 42, 0.18)",
      padding: 12,
      position: "absolute" as const,
      right: 0,
      width: 260
    },
    brandMenuItem: {
      alignItems: "center",
      background: "transparent",
      border: "none",
      borderRadius: 16,
      color: textPrimary,
      cursor: "pointer",
      display: "flex",
      font: "inherit",
      justifyContent: "space-between",
      padding: "12px 14px",
      textAlign: "left" as const,
      width: "100%"
    },
    brandMenuItemActive: {
      background: panelSurface
    },
    brandMenuList: {
      display: "grid",
      gap: 6
    },
    desktopRail: {
      display: "grid",
      gap: 16,
      maxWidth: 360
    },
    flowCard: {
      background: pageSurface,
      border: `1px solid ${borderColor}`,
      borderRadius: 24,
      display: "grid",
      gap: 6,
      padding: 16
    },
    flowList: {
      display: "grid",
      gap: 12
    },
    layout: {
      alignItems: "start",
      display: "grid",
      gap: 32,
      gridTemplateColumns: "minmax(0, 360px) minmax(0, 430px)",
      justifyContent: "center",
      margin: "0 auto",
      maxWidth: 1080,
      minHeight: "100vh",
      padding: "32px 20px 48px",
      position: "relative" as const
    },
    overlayArea: {
      bottom: 18,
      left: 18,
      pointerEvents: "none" as const,
      position: "absolute" as const,
      right: 18,
      top: 18
    },
    page: {
      background: `linear-gradient(180deg, ${panelSurface} 0%, ${pageSurface} 100%)`,
      minHeight: "100vh",
      position: "relative" as const
    },
    phone: {
      background: "#FFFFFF",
      border: `1px solid ${borderColor}`,
      borderRadius: 36,
      boxShadow: "0 34px 120px rgba(15, 23, 42, 0.18)",
      height: 800,
      overflow: "hidden",
      position: "relative" as const,
      width: 360
    },
    phoneInner: {
      height: "100%",
      minHeight: "100%",
      overflowX: "hidden" as const,
      overflowY: "auto" as const,
      scrollbarWidth: "none" as const
    },
    phoneWrap: {
      margin: "0 auto",
      width: 360,
      position: "relative" as const,
      maxWidth: 360
    }
  };
}

function bookCardStyles(brand: DisplayBrandId, compact: boolean): CSSProperties {
  return {
    background: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    border: `1px solid ${String(getRequiredThemeTokenValue(brand, "color.border.default"))}`,
    borderRadius: compact ? 22 : 26,
    cursor: "pointer",
    display: "grid",
    gap: 12,
    padding: 12,
    textAlign: "left",
    width: compact ? 152 : 168
  };
}

function resultRowStyles(brand: DisplayBrandId): CSSProperties {
  return {
    alignItems: "center",
    background: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    border: `1px solid ${String(getRequiredThemeTokenValue(brand, "color.border.default"))}`,
    borderRadius: 20,
    color: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
    cursor: "pointer",
    display: "grid",
    gap: 12,
    gridTemplateColumns: "1fr auto",
    padding: "14px 16px",
    width: "100%"
  };
}

function metricBlockStyles(brand: DisplayBrandId): CSSProperties {
  return {
    background: String(getRequiredThemeTokenValue(brand, "color.surface.subtle")),
    borderRadius: 18,
    display: "grid",
    gap: 4,
    padding: "14px 12px",
    textAlign: "center"
  };
}

function reportCardStyles(brand: DisplayBrandId): CSSProperties {
  return {
    background: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    border: `1px solid ${String(getRequiredThemeTokenValue(brand, "color.border.default"))}`,
    borderRadius: 24,
    display: "grid",
    gap: 16,
    padding: 16
  };
}

function feedCardStyles(brand: DisplayBrandId, compact: boolean): CSSProperties {
  return {
    background: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    border: `1px solid ${String(getRequiredThemeTokenValue(brand, "color.border.default"))}`,
    borderRadius: 22,
    color: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
    cursor: "pointer",
    display: "grid",
    gap: compact ? 0 : 12,
    padding: compact ? "12px 14px" : 16,
    width: "100%"
  };
}

function addCardStyles(brand: DisplayBrandId): CSSProperties {
  return {
    alignItems: "center",
    background: String(getRequiredThemeTokenValue(brand, "color.surface.subtle")),
    border: `1px dashed ${String(getRequiredThemeTokenValue(brand, "color.border.default"))}`,
    borderRadius: 22,
    color: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
    cursor: "pointer",
    display: "grid",
    gap: 8,
    justifyItems: "center",
    minHeight: 230,
    padding: 16
  };
}

function profileHeroStyles(brand: DisplayBrandId): CSSProperties {
  return {
    alignItems: "center",
    background: String(getRequiredThemeTokenValue(brand, "color.surface.subtle")),
    borderRadius: 28,
    display: "grid",
    gap: 16,
    justifyItems: "center",
    padding: 20
  };
}

const plainButtonStyles: CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  width: "100%"
};

const sliderRailStyles: CSSProperties = {
  display: "flex",
  gap: 12,
  overflowX: "auto",
  padding: "0 12px 4px"
};

const sliderButtonReset: CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0
};
