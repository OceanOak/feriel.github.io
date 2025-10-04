module Pages.Hobbies exposing (view)

import Components.Common exposing (cardSection)
import Components.Terminal
import Html exposing (Html, div, img)
import Html.Attributes exposing (alt, class, id, src, style)


view : Html msg
view =
    div [ class "min-h-screen py-4 font-quicksand", style "background-color" "#1E1E1E" ]
        [ div [ class "max-w-7xl mx-auto mt-10" ]
            [ Components.Common.backButton
            , div [ class "grid grid-cols-1 lg:grid-cols-2 gap-10 justify-between" ]
                [ viewImage
                , div [ class "space-y-8" ]
                    [ cardSection "Hands-On Creation" [ "Drawing & Painting", "Cooking & Baking" ]
                    , cardSection "Tech Projects" [ "Arduino experiments", "Life automation and smart setups" ]
                    , cardSection "Continuous Learning" [ "Learning new things", "Puzzles and brain teasers", "Journaling" ]
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
            [ src "img/Hobby.png"
            , alt "Hobbies illustration"
            , class "max-w-full h-auto drop-shadow-2xl"
            ]
            []
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
