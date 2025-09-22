import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Navigation from "@/components/navigation"

// Collection data - in a real app, this would come from a CMS or database
const collections = {
  "charles-conlon": {
    title: "Charles M. Conlon",
    subtitle: "Master of Baseball Photography",
    description:
      "Charles Martin Conlon (1868-1945) was the premier baseball photographer of the early 20th century, capturing the golden age of America's pastime with unprecedented artistry and technical precision.",
    hero: "/vintage-black-and-white-baseball-photograph-by-cha.png",
    photographs: [
      {
        id: 1,
        image: "/charles-conlon-babe-ruth-swing-photograph-1920s-vi.png",
        title: "Babe Ruth's Perfect Swing",
        year: "1923",
        story:
          "This iconic photograph captures Babe Ruth at the peak of his swing, demonstrating Conlon's mastery of timing and composition. Shot during Ruth's legendary 1923 season, this image became one of the most reproduced baseball photographs in history. Conlon's ability to freeze motion while maintaining perfect exposure made him the definitive chronicler of baseball's golden age.",
      },
      {
        id: 2,
        image: "/charles-conlon-ty-cobb-sliding-action-shot-vintage.png",
        title: "Ty Cobb's Aggressive Slide",
        year: "1912",
        story:
          "Conlon's fearless approach to action photography is evident in this dramatic capture of Ty Cobb sliding into base. The Georgia Peach's notorious intensity is perfectly preserved in this moment, showcasing both the photographer's technical skill and his understanding of baseball's emotional drama. This photograph helped establish the visual language of sports photography.",
      },
      {
        id: 3,
        image: "/charles-conlon-walter-johnson-pitching-motion-191.png",
        title: "Walter Johnson's Fastball",
        year: "1915",
        story:
          "The 'Big Train' Walter Johnson's legendary fastball is captured mid-delivery in this masterful composition. Conlon's understanding of baseball mechanics allowed him to anticipate the perfect moment when Johnson's form was most dynamic yet clear. This photograph demonstrates the photographer's ability to combine technical excellence with artistic vision.",
      },
    ],
  },
  "color-line": {
    title: "The Color Line and Jackie Robinson",
    subtitle: "Breaking Barriers Through the Lens",
    description:
      "The visual documentation of baseball's integration represents one of the most significant chapters in American sports and civil rights history, captured through the lens of courage and change.",
    hero: "/vintage-photograph-of-jackie-robinson-breaking-the.png",
    photographs: [
      {
        id: 1,
        image: "/jackie-robinson-first-game-brooklyn-dodgers-1947-.png",
        title: "First Game at Ebbets Field",
        year: "1947",
        story:
          "April 15, 1947 - Jackie Robinson takes the field for the Brooklyn Dodgers, breaking baseball's color barrier. This photograph captures not just a moment in sports history, but a pivotal point in the American civil rights movement. The tension and hope of that day are palpable in every detail of this historic image.",
      },
      {
        id: 2,
        image: "/jackie-robinson-stealing-home-plate-dramatic-act.png",
        title: "Stealing Home",
        year: "1948",
        story:
          "Robinson's daring steal of home plate exemplified his aggressive, intelligent style of play that revolutionized baseball strategy. This dramatic action shot captures the moment that defined Robinson not just as a barrier-breaker, but as one of the game's most dynamic players. His fearless approach changed how baseball was played.",
      },
      {
        id: 3,
        image: "/integration-crowd-reaction-mixed-emotions-1947-b.png",
        title: "Crowd Reactions",
        year: "1947",
        story:
          "The faces in the stands tell the complex story of America grappling with change. This photograph documents the mixed reactions of fans during Robinson's early games, capturing both the resistance and acceptance that characterized this transformative period in American history.",
      },
    ],
  },
  "negro-leagues": {
    title: "The Negro Leagues",
    subtitle: "Celebrating Excellence and Resilience",
    description:
      "The Negro Leagues represented the pinnacle of African American baseball excellence during the era of segregation, showcasing extraordinary talent, community spirit, and resilience in the face of systemic exclusion.",
    hero: "/vintage-negro-leagues-baseball-team-photograph-sho.png",
    photographs: [
      {
        id: 1,
        image: "/satchel-paige-pitching-kansas-city-monarchs-193.png",
        title: "Satchel Paige's Legendary Windup",
        year: "1935",
        story:
          "Leroy 'Satchel' Paige's distinctive pitching style made him the most famous player in Negro League history. This photograph captures his unique windup that became his trademark, demonstrating the showmanship and skill that made Negro League games must-see entertainment. Paige's longevity and talent eventually earned him a place in the major leagues and the Hall of Fame.",
      },
      {
        id: 2,
        image: "/homestead-grays-team-photo-1930s-negro-leagues.png",
        title: "Homestead Grays Championship Team",
        year: "1937",
        story:
          "The Homestead Grays dominated Negro League baseball in the 1930s and 1940s, featuring legends like Josh Gibson and Buck Leonard. This team photograph represents the pinnacle of organized African American baseball, showcasing players whose talents rivaled or exceeded their major league contemporaries.",
      },
      {
        id: 3,
        image: "/negro-league-world-series-celebration-1940s-v.png",
        title: "World Series Celebration",
        year: "1943",
        story:
          "The Negro League World Series was the culmination of each season, bringing together the best teams from across the country. This celebration photograph captures the joy and pride of championship victory, representing not just athletic achievement but community triumph during a challenging era in American history.",
      },
    ],
  },
  "baseball-art": {
    title: "American Icon: The Baseball as Art and Invention",
    subtitle: "The Evolution of America's Pastime",
    description:
      "The baseball itself has evolved from a simple handcrafted sphere to a precisely engineered piece of sporting equipment, becoming both functional tool and cultural symbol of American ingenuity.",
    hero: "/vintage-artistic-photograph-of-baseball-equipment-.png",
    photographs: [
      {
        id: 1,
        image: "/early-baseball-construction-handstitched-leather.png",
        title: "Handcrafted Origins",
        year: "1870s",
        story:
          "Early baseballs were entirely handmade, with each ball unique in its construction. This photograph shows the meticulous craftsmanship required to create these early spheres, from the rubber core to the hand-stitched leather cover. The irregularities in these early balls added unpredictability to the game that modern standardization has eliminated.",
      },
      {
        id: 2,
        image: "/baseball-manufacturing-process-1920s-industrial.png",
        title: "Industrial Revolution",
        year: "1920s",
        story:
          "The industrialization of baseball manufacturing brought consistency and quality control to the game. This photograph documents the transition from handcraft to machine production, showing how American industrial innovation transformed even the most traditional aspects of the national pastime.",
      },
      {
        id: 3,
        image: "/artistic-still-life-vintage-baseballs-different.png",
        title: "Evolution of Design",
        year: "1900-1950",
        story:
          "This artistic arrangement showcases the evolution of baseball design over five decades. From the early 'dead ball' era through the introduction of the livelier ball in the 1920s, each sphere represents a different chapter in baseball's technological development and its impact on how the game was played.",
      },
    ],
  },
}

interface CollectionPageProps {
  params: {
    slug: string
  }
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = collections[params.slug as keyof typeof collections]

  if (!collection) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation currentPath={`/collections/${params.slug}`} />

      {/* Hero Section - Fibonacci ratio: 1.618:1 */}
      <section className="pt-20">
        <div className="relative">
          <div className="aspect-[1.618/1] relative overflow-hidden">
            <img
              src={collection.hero || "/placeholder.svg"}
              alt={collection.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-6">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4">{collection.title}</h1>
                <h2 className="text-xl lg:text-2xl font-medium mb-6">{collection.subtitle}</h2>
                <p className="text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">{collection.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Navigation */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="outline" asChild className="mb-8 bg-transparent">
            <a href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Collections
            </a>
          </Button>
        </div>
      </section>

      {/* Photographs Grid - Each photo with 1.618:1 ratio for image to text */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          {collection.photographs.map((photo, index) => (
            <div key={photo.id} className="grid grid-cols-1 lg:grid-cols-8 gap-12 items-center">
              {/* Image Section - 5 columns (larger portion following Fibonacci) */}
              <div className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-0">
                    <div className="aspect-[1.618/1] relative">
                      <img
                        src={photo.image || "/placeholder.svg"}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Text Section - 3 columns (smaller portion following Fibonacci) */}
              <div className={`lg:col-span-3 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-2">{photo.title}</h3>
                    <p className="text-lg text-primary font-medium">{photo.year}</p>
                  </div>
                  <p className="text-lg text-foreground/80 leading-relaxed">{photo.story}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation to Other Collections */}
      <section className="py-16 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Explore More Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(collections)
              .filter(([slug]) => slug !== params.slug)
              .slice(0, 3)
              .map(([slug, otherCollection]) => (
                <Card key={slug} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
                  <a href={`/collections/${slug}`}>
                    <CardContent className="p-0">
                      <div className="aspect-[1.618/1] relative overflow-hidden">
                        <img
                          src={otherCollection.hero || "/placeholder.svg"}
                          alt={otherCollection.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-bold mb-1">{otherCollection.title}</h3>
                          <p className="text-white/90 text-sm">{otherCollection.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </a>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
