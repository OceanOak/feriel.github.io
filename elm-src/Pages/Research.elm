module Pages.Research exposing (view)

import Components.Common exposing (cardSection)
import Components.Terminal
import Html exposing (Html, a, div, h2, img, p, text)
import Html.Attributes exposing (alt, class, href, id, src, style)


view : Html msg
view =
    div [ class "min-h-screen py-4 font-quicksand", style "background-color" "#1E1E1E" ]
        [ div [ class "max-w-7xl mx-auto mt-10" ]
            [ Components.Common.backButton
            , div [ class "grid grid-cols-1 lg:grid-cols-2 gap-10 justify-between" ]
                [ viewImage
                , div [ class "space-y-8" ]
                    [ cardSection "Product Design" [ "Creating great experiences for users", "Designing intuitive interfaces", "Building accessible products" ]
                    , contentSection "AI & Agentic Systems" "Exploring autonomous AI agents and their applications"
                    ]
                ]
            ]
        , viewCLIButton
        , Components.Terminal.viewTerminalModal
        ]


viewImage : Html msg
viewImage =
    div [ class "flex justify-center lg:justify-start" ]
        [ img
            [ src "img/Search.png"
            , alt "Research illustration"
            , class "max-w-full h-auto drop-shadow-2xl"
            ]
            []
        ]


contentSection : String -> String -> Html msg
contentSection heading content =
    div [ class "rounded-lg px-8 py-6 relative hover:bg-opacity-80 transition-colors cursor-pointer", style "background-color" "#171717" ]
        [ div [ class "flex items-center gap-4 mb-2" ]
            [ h2 [ class "text-2xl font-bold text-white" ] [ text heading ]
            ]
        , p [ class "text-gray-300 text-lg ml-4" ] [ text content ]
        , div [ class "absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 text-4xl" ]
            [ text "›" ]
        ]


viewCLIButton : Html msg
viewCLIButton =
    div
        [ id "cli-toggle-button"
        , class "fixed bottom-8 left-8 cursor-pointer transition-all duration-300 hover:scale-110 z-40"
        ]
        [ img
            [ src "img/CLI.png"
            , alt "Open CLI"
            , class "w-16 h-16 drop-shadow-2xl"
            ]
            []
        ]
