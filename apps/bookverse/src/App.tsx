import {
  useState,
  type CSSProperties,
  type ReactNode,
  type ChangeEvent,
} from "react";
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
  getRequiredThemeTokenValue,
} from "@turbo/web";

// ─── Types ──────────────────────────────────────────────────────────────────

type ScreenId = "explore" | "search" | "detail" | "mybooks" | "feed" | "profile";
type ExploreTab = "discover" | "foryou";
type FeedTab = "cards" | "compact";
type BrandOption = DisplayBrandId;

interface Book {
  id: string;
  title: string;
  author: string;
  blurb: string;
  rating: number;
  borrowed: string;
  reviews: string;
  accentA: string;
  accentB: string;
  shelf: string;
}

interface FeedPost {
  id: string;
  authorInitials: string;
  authorName: string;
  headline: string;
  body: string;
  tag: string;
  hasImage: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const BRANDS: BrandOption[] = ["Cars24", "Team BHP", "CarInfo", "VehicleInfo"];

const BOOKS: Book[] = [
  {
    id: "hp",
    title: "Harry Potter and the Ember Archive",
    author: "Harriet Winters",
    blurb: "A magical boarding-school saga with warm friendships, hidden chambers, and midnight clues.",
    rating: 4.5,
    borrowed: "1,000",
    reviews: "475",
    accentA: "#F59E0B",
    accentB: "#7C2D12",
    shelf: "Recommended this week",
  },
  {
    id: "bo",
    title: "Harry Potter and the Blue Orbit",
    author: "Mina Sol",
    blurb: "A quiet sci-fi novel about memory, migration, and rebuilding a life among the stars.",
    rating: 4.7,
    borrowed: "820",
    reviews: "208",
    accentA: "#60A5FA",
    accentB: "#1E3A8A",
    shelf: "Popular books",
  },
  {
    id: "bq",
    title: "Building Quietly",
    author: "R. K. Linton",
    blurb: "A founder memoir with tactical chapters on team culture, conviction, and staying useful under pressure.",
    rating: 4.2,
    borrowed: "540",
    reviews: "121",
    accentA: "#34D399",
    accentB: "#064E3B",
    shelf: "My Booklist",
  },
];

const GENRES = ["Fantasy", "Thriller", "Memoir", "Sci-Fi", "Romance", "Mystery"];

const AUTHORS = [
  { initials: "HW", name: "H. Winters" },
  { initials: "MS", name: "Mina Sol" },
  { initials: "RK", name: "R. Linton" },
  { initials: "AN", name: "A. Nair" },
];

const FEED_POSTS: FeedPost[] = [
  {
    id: "f1",
    authorInitials: "NP",
    authorName: "Nina Patel",
    headline: "Finished Blue Orbit House",
    body: "The last 50 pages are all atmosphere and payoff. Highly recommend for any sci-fi fan.",
    tag: "Review",
    hasImage: true,
  },
  {
    id: "f2",
    authorInitials: "HM",
    authorName: "Harsh Mehta",
    headline: "Best magical-school books?",
    body: "Starting a fantasy thread — which magical-school book still feels adult?",
    tag: "Discussion",
    hasImage: true,
  },
  {
    id: "f3",
    authorInitials: "MR",
    authorName: "Mira Rao",
    headline: "Library loan reminder saved me",
    body: "Borrowed copy ready for pickup tomorrow. The app notification came at the perfect time.",
    tag: "Update",
    hasImage: true,
  },
  {
    id: "f4",
    authorInitials: "SK",
    authorName: "Sam Kumar",
    headline: "Building Quietly is underrated",
    body: "Every founder should read chapter 7. It reframes how to think about early-stage culture.",
    tag: "Review",
    hasImage: false,
  },
];

// ─── Root ────────────────────────────────────────────────────────────────────

export function App() {
  const [brand, setBrand] = useState<BrandOption>("Cars24");
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [screen, setScreen] = useState<ScreenId>("explore");
  const [selectedBook, setSelectedBook] = useState<Book>(BOOKS[0]!);
  const [prevScreen, setPrevScreen] = useState<ScreenId>("explore");

  const shell = shellStyles(brand);
  const navValue: string =
    screen === "detail" || screen === "search" ? "explore" : screen;

  function openBook(book: Book, from: ScreenId) {
    setPrevScreen(from);
    setSelectedBook(book);
    setScreen("detail");
  }

  function openSearch() {
    setPrevScreen(screen);
    setScreen("search");
  }

  return (
    <div data-brand={brand} style={shell.page}>
      {/* ambient glow */}
      <div aria-hidden="true" style={shell.glow} />

      <div style={shell.layout}>
        {/* ── desktop sidebar ── */}
        <aside style={shell.sidebar}>
          <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
            Wireframe prototype
          </Text>
          <Text as="strong" brand={brand} size="xl" style={{ display: "block", margin: 0 }}>
            Bookverse — social reading app
          </Text>
          <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
            8 screens from your sketch — explore, search, detail, my books, feed (×2), and profile — wired up and navigable.
          </Text>
          <div style={shell.flowList}>
            {(
              [
                ["Explore", "Home screen with recommendation shelves and genre grid."],
                ["Search", "Live query state with book and author results."],
                ["Book detail", "Cover, stats, intro, and author block."],
                ["My books", "Recently read, booklist, and reading report."],
                ["Feed (cards)", "News following with thumbnail cards and dismiss."],
                ["Feed (compact)", "Compact avatar-led feed rows."],
                ["Profile", "Personal home screen with reading stats."],
              ] as [string, string][]
            ).map(([title, body]) => (
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

        {/* ── phone frame ── */}
        <div style={shell.phoneWrap}>
          <div style={shell.phone}>
            <div style={shell.phoneInner}>
              {screen === "explore" && (
                <ExploreScreen
                  brand={brand}
                  onOpenBook={(b) => openBook(b, "explore")}
                  onOpenSearch={openSearch}
                />
              )}
              {screen === "search" && (
                <SearchScreen
                  brand={brand}
                  onBack={() => setScreen(prevScreen)}
                  onOpenBook={(b) => openBook(b, "search")}
                />
              )}
              {screen === "detail" && (
                <DetailScreen
                  brand={brand}
                  book={selectedBook}
                  onBack={() => setScreen(prevScreen)}
                />
              )}
              {screen === "mybooks" && (
                <MyBooksScreen
                  brand={brand}
                  onOpenBook={(b) => openBook(b, "mybooks")}
                />
              )}
              {screen === "feed" && <FeedScreen brand={brand} />}
              {screen === "profile" && (
                <ProfileScreen
                  brand={brand}
                  onOpenBook={(b) => openBook(b, "profile")}
                />
              )}
            </div>

            {/* sticky bottom nav */}
            <div style={shell.navWrap}>
              <BottomNav
                brand={brand}
                configuration="Label + icon"
                items={[
                  { ariaLabel: "Explore", iconName: "magnifying-glass-outline", label: "Explore", value: "explore" },
                  { ariaLabel: "My books", iconName: "book-open-outline", label: "My books", value: "mybooks" },
                  { ariaLabel: "Feed", iconName: "sparkle-line", label: "Feed", value: "feed" },
                  { ariaLabel: "Profile", iconName: "people-circle-user-circle-avatar-profile-outline", label: "Me", value: "profile" },
                ]}
                style={{ width: "100%" }}
                type="Sticky"
                value={navValue}
                onValueChange={(v: string) => setScreen(v as ScreenId)}
              />
            </div>
          </div>

          {/* brand switcher overlay */}
          <div style={shell.overlayArea}>
            <div style={shell.fabWrap}>
              <FabButton
                aria-label="Switch brand"
                brand={brand}
                icon={<Icon decorative name="sparkle-filled" />}
                showTag={false}
                tagLabel=""
                onClick={() => setBrandMenuOpen((o) => !o)}
              >
                Brand
              </FabButton>
            </div>
            {brandMenuOpen && (
              <div style={shell.brandMenu(brand)}>
                <SectionHeader
                  brand={brand}
                  description="Switch token system live."
                  showAction={false}
                  showTag={false}
                  title="Switch brand"
                />
                <div style={{ display: "grid", gap: 4 }}>
                  {BRANDS.map((opt) => (
                    <button
                      key={opt}
                      style={shell.brandItem(brand, opt === brand)}
                      type="button"
                      onClick={() => {
                        setBrand(opt);
                        setBrandMenuOpen(false);
                      }}
                    >
                      <span>{opt}</span>
                      {opt === brand && <Icon decorative name="check-outline" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Explore ────────────────────────────────────────────────────────

function ExploreScreen({
  brand,
  onOpenBook,
  onOpenSearch,
}: {
  brand: DisplayBrandId;
  onOpenBook: (b: Book) => void;
  onOpenSearch: () => void;
}) {
  const [tab, setTab] = useState<ExploreTab>("discover");

  return (
    <Screen
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
      {/* search bar tap-target */}
      <Block>
        <div style={{ cursor: "pointer" }} onClick={onOpenSearch}>
          <SearchBar
            brand={brand}
            color="Solid White"
            placeholder="Search books, authors…"
            readOnly
            size="Large"
          />
        </div>
      </Block>

      {/* explore mode chips */}
      <Block>
        <Row>
          <ChoiceChip brand={brand} label="Discover" size="Small" state={tab === "discover" ? "Active" : "Rest"} variant="Horizontal" onClick={() => setTab("discover")} />
          <ChoiceChip brand={brand} label="For you" size="Small" state={tab === "foryou" ? "Active" : "Rest"} variant="Horizontal" onClick={() => setTab("foryou")} />
          <ChoiceChip brand={brand} label="Scan book" size="Small" state="Rest" variant="Horizontal" />
        </Row>
      </Block>

      {tab === "discover" ? (
        <>
          {/* recommended this week */}
          <StaticSliderWidget
            brand={brand}
            description=""
            headerActionLabel="View all"
            showCta={false}
            showHeaderAction
            showTag={false}
            showTabSlider={false}
            subtitle=""
            title="Recommend this week"
          >
            <div style={sliderRail}>
              {BOOKS.map((book) => (
                <button key={book.id} style={btnReset} type="button" onClick={() => onOpenBook(book)}>
                  <StaticSliderCard
                    brand={brand}
                    columnCount="1+"
                    description={book.author}
                    size="Medium"
                    tagLabel=""
                    title={book.title}
                    type="Text Outside"
                  >
                    <BookCover book={book} />
                  </StaticSliderCard>
                </button>
              ))}
            </div>
          </StaticSliderWidget>

          {/* top genres */}
          <GridWidget
            brand={brand}
            description=""
            headerActionLabel="Explore all"
            primaryAction={null}
            showHeaderAction={false}
            showTag={false}
            subtitle=""
            title="Top Genres"
          >
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(2, 1fr)", width: "100%" }}>
              {GENRES.slice(0, 4).map((g) => (
                <GridCard
                  key={g}
                  brand={brand}
                  columnCount="2 Column"
                  description=""
                  size="Medium"
                  tagLabel=""
                  title={g}
                  type="Text Outside"
                />
              ))}
            </div>
          </GridWidget>

          {/* authors you like */}
          <Section brand={brand} title="Authors you like" description="Continue from writers you already follow.">
            <AuthorRow brand={brand} />
          </Section>
        </>
      ) : (
        <>
          {/* for-you tab: authors first */}
          <Section brand={brand} title="Authors you like" description="A people-first personalised explore.">
            <AuthorRow brand={brand} />
          </Section>

          <StaticSliderWidget
            brand={brand}
            description=""
            headerActionLabel="View all"
            showCta={false}
            showHeaderAction
            showTag={false}
            showTabSlider={false}
            subtitle=""
            title="Popular books"
          >
            <div style={sliderRail}>
              {BOOKS.map((book) => (
                <button key={book.id} style={btnReset} type="button" onClick={() => onOpenBook(book)}>
                  <StaticSliderCard
                    brand={brand}
                    columnCount="1+"
                    description={book.author}
                    size="Medium"
                    tagLabel=""
                    title={book.title}
                    type="Text Outside"
                  >
                    <BookCover book={book} />
                  </StaticSliderCard>
                </button>
              ))}
            </div>
          </StaticSliderWidget>

          {/* top genres — horizontal chip scroll */}
          <Section brand={brand} title="Top Genres" description="Browse by category.">
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {GENRES.map((g, i) => (
                <ChoiceChip key={g} brand={brand} label={g} size="Small" state={i === 0 ? "Active" : "Rest"} variant="Horizontal" />
              ))}
            </div>
          </Section>
        </>
      )}
    </Screen>
  );
}

// ─── Screen: Search ──────────────────────────────────────────────────────────

function SearchScreen({
  brand,
  onBack,
  onOpenBook,
}: {
  brand: DisplayBrandId;
  onBack: () => void;
  onOpenBook: (b: Book) => void;
}) {
  const [query, setQuery] = useState("Harry");
  const [scope, setScope] = useState<"Books" | "Author">("Books");

  const bookResults = BOOKS.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase())
  );
  const authorResults = AUTHORS.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Screen
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.currentTarget.value)}
            onClearClick={() => setQuery("")}
          />
        </div>
      }
    >
      <Block>
        <Row>
          <ChoiceChip brand={brand} label="Books" size="Small" state={scope === "Books" ? "Active" : "Rest"} variant="Horizontal" onClick={() => setScope("Books")} />
          <ChoiceChip brand={brand} label="Author" size="Small" state={scope === "Author" ? "Active" : "Rest"} variant="Horizontal" onClick={() => setScope("Author")} />
          <ChoiceChip brand={brand} label="Scan book" size="Small" state="Rest" variant="Horizontal" />
        </Row>
      </Block>

      {scope === "Books" ? (
        <Section brand={brand} title="Books" description="">
          <div style={{ display: "grid", gap: 8 }}>
            {bookResults.map((book) => (
              <ResultRow key={book.id} brand={brand} title={book.title} sub={book.author} onClick={() => onOpenBook(book)} />
            ))}
          </div>
        </Section>
      ) : (
        <Section brand={brand} title="Author" description="">
          <div style={{ display: "grid", gap: 8 }}>
            {authorResults.map((a) => (
              <ResultRow key={a.initials} brand={brand} title={a.name} sub="Author" />
            ))}
            {/* fallback when no match */}
            {authorResults.length === 0 && (
              <ResultRow brand={brand} title="Harry Winston" sub="Author" />
            )}
          </div>
        </Section>
      )}
    </Screen>
  );
}

// ─── Screen: Book Detail ─────────────────────────────────────────────────────

function DetailScreen({
  book,
  brand,
  onBack,
}: {
  book: Book;
  brand: DisplayBrandId;
  onBack: () => void;
}) {
  return (
    <Screen
      brand={brand}
      header={
        <AppHeader
          actions={[{ icon: <Icon decorative name="heart-like-outline" />, label: "Save" }]}
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
      {/* large cover */}
      <Block>
        <BookCover book={book} large />
      </Block>

      {/* title + author */}
      <Block>
        <Text as="strong" brand={brand} size="lg" style={{ display: "block", margin: 0 }}>
          {book.title}
        </Text>
        <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: "4px 0 0" }}>
          {book.author}
        </Text>

        {/* stats grid */}
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(3, 1fr)", marginTop: 16 }}>
          <StatTile brand={brand} value={String(book.rating)} label="Rating" />
          <StatTile brand={brand} value={book.borrowed} label="Borrowed" />
          <StatTile brand={brand} value={book.reviews} label="Reviews" />
        </div>

        <div style={{ marginTop: 10 }}>
          <Ratings brand={brand} rating={book.rating} />
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Button brand={brand} shape="Pill" size="Large" styleVariant="Outline">
            Want
          </Button>
          <Button brand={brand} shape="Pill" size="Large">
            Read
          </Button>
        </div>
      </Block>

      {/* intro */}
      <Section brand={brand} title="Intro" description="">
        <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0, lineHeight: 1.6 }}>
          {book.blurb}
        </Text>
        <Banner
          brand={brand}
          action={false}
          description="Borrow digitally, track progress, and join a discussion thread from one place."
          heading={false}
          state="Info"
        />
      </Section>

      {/* about author */}
      <Section brand={brand} title="About Author" description="">
        <div style={{ alignItems: "center", display: "grid", gap: 12, gridTemplateColumns: "auto 1fr" }}>
          <Avatar appearance="Initials" adornment="None" brand={brand} initials={book.author.slice(0, 2).toUpperCase()} size="Extra large" />
          <div>
            <Text as="strong" brand={brand} size="sm" style={{ margin: 0 }}>
              {book.author}
            </Text>
            <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: "4px 0 0" }}>
              Writes immersive stories with warm ensemble casts and satisfying reveals.
            </Text>
          </div>
        </div>
      </Section>
    </Screen>
  );
}

// ─── Screen: My Books ────────────────────────────────────────────────────────

function MyBooksScreen({
  brand,
  onOpenBook,
}: {
  brand: DisplayBrandId;
  onOpenBook: (b: Book) => void;
}) {
  const surface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const border = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const brandPrimary = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const muted = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));

  return (
    <Screen
      brand={brand}
      header={
        <AppHeader
          actions={[{ icon: <Icon decorative name="bell-outline" />, label: "Notifications" }]}
          brand={brand}
          level="Page - L2"
          showAvatar
          subtitle="Your shelf"
          title="My Books"
          variant="Light"
        />
      }
    >
      {/* search */}
      <Block>
        <SearchBar brand={brand} color="Solid White" placeholder="Search your library…" readOnly size="Large" />
      </Block>

      {/* recently read */}
      <Section brand={brand} title="Recently" description="">
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {BOOKS.map((book) => (
            <button key={book.id} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} type="button" onClick={() => onOpenBook(book)}>
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, display: "grid", gap: 10, padding: 10, width: 148 }}>
                <BookCover book={book} height={110} />
                <div>
                  <Text as="strong" brand={brand} size="sm" style={{ display: "block", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 128 }}>
                    {book.title}
                  </Text>
                  <Text as="span" brand={brand} size="sm" tone="secondary">
                    {book.author}
                  </Text>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* my booklist */}
      <Section brand={brand} title="My Booklist" description="">
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(2, 1fr)" }}>
          {BOOKS.slice(0, 1).map((book) => (
            <button key={book.id} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} type="button" onClick={() => onOpenBook(book)}>
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, display: "grid", gap: 10, padding: 10 }}>
                <BookCover book={book} height={130} />
                <Text as="strong" brand={brand} size="sm" style={{ display: "block", margin: 0 }}>
                  {book.title}
                </Text>
              </div>
            </button>
          ))}
          {/* add slot */}
          <div style={{ alignItems: "center", background: muted, border: `1.5px dashed ${border}`, borderRadius: 20, display: "grid", gap: 8, justifyItems: "center", minHeight: 200, padding: 16 }}>
            <Icon decorative name="circle-plus-add-filled" />
            <Text as="span" brand={brand} size="sm" tone="secondary">
              Add title
            </Text>
          </div>
        </div>
      </Section>

      {/* reading report */}
      <Section brand={brand} title="Report" description="">
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 22, display: "grid", gap: 16, padding: 16 }}>
          <div style={{ alignItems: "end", display: "grid", gap: 6, gridTemplateColumns: "repeat(7, 1fr)", minHeight: 120 }}>
            {[40, 55, 65, 44, 70, 90, 58].map((h, i) => (
              <div
                key={i}
                style={{
                  background: i === 5 ? brandPrimary : muted,
                  borderRadius: 999,
                  height: h,
                  width: "100%",
                }}
              />
            ))}
          </div>
          <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
            You read 312 pages this week and finished 2 books.
          </Text>
        </div>
      </Section>
    </Screen>
  );
}

// ─── Screen: Feed ────────────────────────────────────────────────────────────

function FeedScreen({ brand }: { brand: DisplayBrandId }) {
  const [tab, setTab] = useState<FeedTab>("cards");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = FEED_POSTS.filter((p) => !dismissed.has(p.id));

  return (
    <Screen
      brand={brand}
      header={
        <AppHeader
          actions={[{ icon: <Icon decorative name="bell-outline" />, label: "Notifications" }]}
          brand={brand}
          level="Page - L2"
          showAvatar
          subtitle="People and posts you follow"
          title="News Following"
          variant="Light"
        />
      }
    >
      <Block>
        <SearchBar brand={brand} color="Solid White" placeholder="Search posts…" readOnly size="Large" />
        <Row>
          <ChoiceChip brand={brand} label="Cards" size="Small" state={tab === "cards" ? "Active" : "Rest"} variant="Horizontal" onClick={() => setTab("cards")} />
          <ChoiceChip brand={brand} label="Compact" size="Small" state={tab === "compact" ? "Active" : "Rest"} variant="Horizontal" onClick={() => setTab("compact")} />
        </Row>
      </Block>

      <div style={{ display: "grid", gap: 10, padding: "0 16px 20px" }}>
        {visible.map((post) =>
          tab === "cards" ? (
            <FeedCardLarge
              key={post.id}
              brand={brand}
              post={post}
              onDismiss={() => setDismissed((s) => new Set([...s, post.id]))}
            />
          ) : (
            <FeedCardCompact
              key={post.id}
              brand={brand}
              post={post}
              onDismiss={() => setDismissed((s) => new Set([...s, post.id]))}
            />
          )
        )}
      </div>
    </Screen>
  );
}

function FeedCardLarge({
  brand,
  onDismiss,
  post,
}: {
  brand: DisplayBrandId;
  onDismiss: () => void;
  post: FeedPost;
}) {
  const surface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const border = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const muted = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 22, display: "grid", gap: 12, overflow: "hidden" }}>
      {/* thumbnail */}
      {post.hasImage && (
        <div style={{ alignItems: "center", background: muted, display: "flex", height: 140, justifyContent: "center", width: "100%" }}>
          <Icon decorative name="image-picture-outline" />
        </div>
      )}
      <div style={{ display: "grid", gap: 6, padding: "0 16px 16px" }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <Text as="strong" brand={brand} size="sm" style={{ margin: 0 }}>
            {post.headline}
          </Text>
          <button
            aria-label="Dismiss"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
            type="button"
            onClick={onDismiss}
          >
            <Icon decorative name="close-line" />
          </button>
        </div>
        <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
          {post.body}
        </Text>
        <Text as="span" brand={brand} size="sm" tone="secondary">
          — {post.authorName}
        </Text>
      </div>
    </div>
  );
}

function FeedCardCompact({
  brand,
  onDismiss,
  post,
}: {
  brand: DisplayBrandId;
  onDismiss: () => void;
  post: FeedPost;
}) {
  const surface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const border = String(getRequiredThemeTokenValue(brand, "color.border.default"));

  return (
    <div style={{ alignItems: "center", background: surface, border: `1px solid ${border}`, borderRadius: 18, display: "grid", gap: 12, gridTemplateColumns: "auto 1fr auto", padding: "12px 14px" }}>
      <Avatar appearance="Initials" adornment="None" brand={brand} initials={post.authorInitials} size="Large" />
      <div style={{ display: "grid", gap: 2, overflow: "hidden" }}>
        <Text as="strong" brand={brand} size="sm" style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {post.headline}
        </Text>
        <Text as="span" brand={brand} size="sm" tone="secondary" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {post.body}
        </Text>
      </div>
      <button
        aria-label="Dismiss"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
        type="button"
        onClick={onDismiss}
      >
        <Icon decorative name="close-line" />
      </button>
    </div>
  );
}

// ─── Screen: Profile ─────────────────────────────────────────────────────────

function ProfileScreen({
  brand,
  onOpenBook,
}: {
  brand: DisplayBrandId;
  onOpenBook: (b: Book) => void;
}) {
  const surface = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  const border = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const canvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));

  return (
    <Screen
      brand={brand}
      header={
        <AppHeader
          actions={[{ icon: <Icon decorative name="settings-gear-line" />, label: "Settings" }]}
          brand={brand}
          level="Page - L2"
          showAvatar={false}
          subtitle="Your reading identity"
          title="Personal Home"
          variant="Light"
        />
      }
    >
      {/* profile hero */}
      <Block>
        <div style={{ alignItems: "center", background: surface, borderRadius: 28, display: "grid", gap: 16, justifyItems: "center", padding: 20 }}>
          <Avatar appearance="Initials" adornment="None" brand={brand} initials="AR" size="Extra large" />
          <div style={{ textAlign: "center" }}>
            <Text as="strong" brand={brand} size="md" style={{ display: "block", margin: 0 }}>
              Aanya Rao
            </Text>
            <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: "4px 0 0" }}>
              Fantasy reader · club host · note-taker
            </Text>
          </div>
          {/* stat tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {["124 books", "89 notes", "12 clubs"].map((tag) => (
              <span
                key={tag}
                style={{
                  background: canvas,
                  border: `1px solid ${border}`,
                  borderRadius: 999,
                  fontSize: 12,
                  padding: "4px 12px",
                }}
              >
                <Text as="span" brand={brand} size="sm">
                  {tag}
                </Text>
              </span>
            ))}
          </div>
        </div>
      </Block>

      {/* feed-style reading items */}
      <div style={{ display: "grid", gap: 10, padding: "0 16px 20px" }}>
        {/* currently reading */}
        <div style={{ alignItems: "center", background: canvas, border: `1px solid ${border}`, borderRadius: 18, display: "grid", gap: 12, gridTemplateColumns: "auto 1fr", padding: "12px 14px" }}>
          <Avatar appearance="Initials" adornment="None" brand={brand} initials="AR" size="Medium" />
          <div>
            <Text as="strong" brand={brand} size="sm" style={{ margin: 0 }}>
              Currently reading
            </Text>
            <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: "2px 0 0" }}>
              Blue Orbit House · 68% · discussion set for Sunday
            </Text>
          </div>
        </div>

        {/* recent books in feed row style */}
        {BOOKS.slice(0, 2).map((book) => (
          <button
            key={book.id}
            style={{ alignItems: "center", background: canvas, border: `1px solid ${border}`, borderRadius: 18, cursor: "pointer", display: "grid", gap: 12, gridTemplateColumns: "auto 1fr", padding: "12px 14px", width: "100%" }}
            type="button"
            onClick={() => onOpenBook(book)}
          >
            <BookCover book={book} height={52} width={52} radius={10} />
            <div style={{ textAlign: "left" }}>
              <Text as="strong" brand={brand} size="sm" style={{ display: "block", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {book.title}
              </Text>
              <Text as="span" brand={brand} size="sm" tone="secondary">
                {book.author}
              </Text>
            </div>
          </button>
        ))}
      </div>
    </Screen>
  );
}

// ─── Primitives ──────────────────────────────────────────────────────────────

function Screen({
  brand,
  children,
  header,
}: {
  brand: DisplayBrandId;
  children: ReactNode;
  header: ReactNode;
}) {
  const bg = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  return (
    <div style={{ background: bg, display: "grid", minHeight: "100%", paddingBottom: 110 }}>
      <div>{header}</div>
      <div>{children}</div>
    </div>
  );
}

function Block({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gap: 12, padding: "16px 16px 0" }}>{children}</div>;
}

function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>;
}

function Section({
  brand,
  children,
  description,
  title,
}: {
  brand: DisplayBrandId;
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div style={{ display: "grid", gap: 10, padding: "16px 16px 0" }}>
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
    </div>
  );
}

function AuthorRow({ brand }: { brand: DisplayBrandId }) {
  return (
    <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 4 }}>
      {AUTHORS.map((a) => (
        <div key={a.initials} style={{ display: "grid", gap: 6, justifyItems: "center", minWidth: 72 }}>
          <Avatar appearance="Initials" adornment="None" brand={brand} initials={a.initials} size="Extra large" />
          <Text as="span" brand={brand} size="sm" tone="secondary" style={{ textAlign: "center" }}>
            {a.name}
          </Text>
        </div>
      ))}
    </div>
  );
}

function ResultRow({
  body: _body,
  brand,
  onClick,
  sub,
  title,
}: {
  body?: string;
  brand: DisplayBrandId;
  onClick?: () => void;
  sub: string;
  title: string;
}) {
  const surface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const border = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const text = String(getRequiredThemeTokenValue(brand, "color.text.primary"));

  return (
    <button
      style={{ alignItems: "center", background: surface, border: `1px solid ${border}`, borderRadius: 18, color: text, cursor: "pointer", display: "grid", gap: 10, gridTemplateColumns: "1fr auto", padding: "12px 14px", width: "100%" }}
      type="button"
      onClick={onClick}
    >
      <div style={{ textAlign: "left" }}>
        <Text as="strong" brand={brand} size="sm" style={{ display: "block", margin: 0 }}>
          {title}
        </Text>
        <Text as="span" brand={brand} size="sm" tone="secondary">
          {sub}
        </Text>
      </div>
      <Icon decorative name="chevron-small-right-filled" />
    </button>
  );
}

function StatTile({
  brand,
  label,
  value,
}: {
  brand: DisplayBrandId;
  label: string;
  value: string;
}) {
  const bg = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  return (
    <div style={{ background: bg, borderRadius: 16, display: "grid", gap: 4, padding: "12px 10px", textAlign: "center" }}>
      <Text as="strong" brand={brand} size="md" style={{ margin: 0 }}>
        {value}
      </Text>
      <Text as="span" brand={brand} size="sm" tone="secondary">
        {label}
      </Text>
    </div>
  );
}

function BookCover({
  book,
  height = 160,
  large = false,
  radius,
  width,
}: {
  book: Book;
  height?: number;
  large?: boolean;
  radius?: number;
  width?: number;
}) {
  const h = large ? 260 : height;
  const w = width ?? "100%";
  const r = radius ?? (large ? 24 : 18);

  return (
    <div
      style={{
        alignItems: "flex-end",
        background: `linear-gradient(145deg, ${book.accentA} 0%, ${book.accentB} 100%)`,
        borderRadius: r,
        boxShadow: "0 16px 40px rgba(15,23,42,0.16)",
        display: "flex",
        height: h,
        overflow: "hidden",
        padding: large ? 20 : 12,
        position: "relative",
        width: w,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "50%",
          height: large ? 160 : 90,
          position: "absolute",
          right: large ? -20 : -10,
          top: large ? -24 : -14,
          width: large ? 160 : 90,
        }}
      />
      <div style={{ color: "#fff", position: "relative" }}>
        <Text as="strong" brand="Cars24" size={large ? "lg" : "sm"} tone="inverse" style={{ display: "block", margin: 0 }}>
          {book.title}
        </Text>
      </div>
    </div>
  );
}

// ─── Shell styles ────────────────────────────────────────────────────────────

function shellStyles(brand: DisplayBrandId) {
  const canvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const subtle = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  const border = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const primary = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const text = String(getRequiredThemeTokenValue(brand, "color.text.primary"));

  return {
    page: {
      background: `linear-gradient(180deg, ${subtle} 0%, ${canvas} 100%)`,
      minHeight: "100vh",
      position: "relative" as const,
    } satisfies CSSProperties,

    glow: {
      background: `radial-gradient(circle at top, ${primary}1a 0%, transparent 55%)`,
      inset: 0,
      pointerEvents: "none" as const,
      position: "fixed" as const,
    } satisfies CSSProperties,

    layout: {
      alignItems: "start",
      display: "grid",
      gap: 40,
      gridTemplateColumns: "minmax(0, 340px) minmax(0, 400px)",
      justifyContent: "center",
      margin: "0 auto",
      maxWidth: 1100,
      minHeight: "100vh",
      padding: "36px 24px 60px",
      position: "relative" as const,
    } satisfies CSSProperties,

    sidebar: {
      display: "grid",
      gap: 20,
      maxWidth: 340,
    } satisfies CSSProperties,

    flowList: { display: "grid", gap: 10 } satisfies CSSProperties,

    flowCard: {
      background: canvas,
      border: `1px solid ${border}`,
      borderRadius: 22,
      display: "grid",
      gap: 4,
      padding: 14,
    } satisfies CSSProperties,

    phoneWrap: {
      margin: "0 auto",
      maxWidth: 390,
      position: "relative" as const,
      width: 390,
    } satisfies CSSProperties,

    phone: {
      background: canvas,
      border: `1px solid ${border}`,
      borderRadius: 40,
      boxShadow: "0 40px 120px rgba(15,23,42,0.18)",
      height: 820,
      overflow: "hidden",
      position: "relative" as const,
      width: 390,
    } satisfies CSSProperties,

    phoneInner: {
      height: "100%",
      overflowX: "hidden" as const,
      overflowY: "auto" as const,
      scrollbarWidth: "none" as const,
    } satisfies CSSProperties,

    navWrap: {
      bottom: 0,
      left: 0,
      padding: "0 12px 12px",
      position: "absolute" as const,
      right: 0,
    } satisfies CSSProperties,

    overlayArea: {
      bottom: 20,
      left: 20,
      pointerEvents: "none" as const,
      position: "absolute" as const,
      right: 20,
      top: 20,
    } satisfies CSSProperties,

    fabWrap: {
      bottom: 0,
      position: "absolute" as const,
      right: 0,
    } satisfies CSSProperties,

    brandMenu: (b: DisplayBrandId): CSSProperties => ({
      background: String(getRequiredThemeTokenValue(b, "color.surface.canvas")),
      border: `1px solid ${String(getRequiredThemeTokenValue(b, "color.border.default"))}`,
      borderRadius: 24,
      bottom: 68,
      boxShadow: "0 24px 72px rgba(15,23,42,0.18)",
      padding: 12,
      position: "absolute",
      right: 0,
      width: 240,
    }),

    brandItem: (b: DisplayBrandId, active: boolean): CSSProperties => ({
      alignItems: "center",
      background: active ? String(getRequiredThemeTokenValue(b, "color.surface.subtle")) : "transparent",
      border: "none",
      borderRadius: 14,
      color: text,
      cursor: "pointer",
      display: "flex",
      font: "inherit",
      justifyContent: "space-between",
      padding: "10px 12px",
      textAlign: "left",
      width: "100%",
    }),
  };
}

// ─── Tiny constants ──────────────────────────────────────────────────────────

const sliderRail: CSSProperties = {
  display: "flex",
  gap: 12,
  overflowX: "auto",
  padding: "0 12px 4px",
};

const btnReset: CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
};
