module Pages.Reading exposing (view)

import Components.Common exposing (cardSection)
import Components.Terminal
import Html exposing (Html, div, h2, img, p, text)
import Html.Attributes exposing (alt, class, src, style)


view : Html msg
view =
    div [ class "min-h-screen py-4 font-quicksand", style "background-color" "#1E1E1E" ]
        [ div [ class "max-w-7xl mx-auto mt-10" ]
            [ Components.Common.backButton
            , div [ class "grid grid-cols-1 lg:grid-cols-2 gap-10 justify-between" ]
                [ viewImage
                , div [ class "space-y-8" ]
                    [ bookSection "Currently Reading" "img/openBook.png" [ "Agentic design patterns", "The Design of Everyday Things - by Don Norman" ]
                    , bookSection "Recently Finished" "img/closedBooksHrz.png" [ "The One-Page Proposal - by Patrick G. Riley", "Building a StoryBrand 2.0 - by donald miller" ]
                    , bookSection "Want To Read" "img/closedBooksVrt.png" [ "Inspired: how to create tech products customers love - by Marty Cagan", "AI Engineering - by Chip Huyen" ]
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
            [ src "img/Read.png"
            , alt "Reading illustration"
            , class "max-w-full h-auto drop-shadow-2xl"
            ]
            []
        ]


bookSection : String -> String -> List String -> Html msg
bookSection heading iconSrc items =
    div [ class "rounded-lg px-8 py-6 relative hover:bg-opacity-80 transition-colors cursor-pointer", style "background-color" "#171717" ]
        [ div [ class "flex items-center gap-4 mb-2" ]
            [ img [ src iconSrc, alt "Book icon", class "w-12 h-12" ] []
            , h2 [ class "text-2xl font-bold text-white" ] [ text heading ]
            ]
        , div [ class "space-y-3 ml-4" ]
            (List.map bookItem items)
        , div [ class "absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 text-4xl" ]
            [ text "›" ]
        ]


bookItem : String -> Html msg
bookItem item =
    div [ class "flex items-start gap-3 text-gray-300 text-lg" ]
        [ div [ class "mt-1.5 flex-shrink-0" ] [ Components.Common.pawIcon ]
        , p [] [ text item ]
        ]


viewCLIButton : Html msg
viewCLIButton =
    div
        [ class "fixed bottom-8 left-8 cursor-pointer transition-all duration-300 hover:scale-110 z-40"
        , Html.Attributes.id "cli-toggle-button"
        ]
        [ img
            [ src "img/CLI.png"
            , alt "Open CLI"
            , class "w-16 h-16 drop-shadow-2xl"
            ]
            []
        ]
