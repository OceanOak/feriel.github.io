module Main exposing (main)

import Browser
import Html exposing (Html, div, h1, img, p, span, text)
import Html.Attributes exposing (alt, class, id, src, style)



-- MODEL


type alias Model =
    {}


init : () -> ( Model, Cmd Msg )
init _ =
    ( {}, Cmd.none )



-- UPDATE


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "min-h-screen text-white flex flex-col relative overflow-hidden font-quicksand", style "background-color" "#1E1E1E" ]
        [ -- Star in top right
          img
            [ src "img/star.png"
            , alt "Star"
            , class "absolute top-8 right-8 w-8 h-8 opacity-80"
            ]
            []

        -- Main content area
        , div [ class "flex-1 flex items-center justify-center py-8" ]
            [ div [ class "max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" ]
                [ -- Left side content
                  div [ class "space-y-8" ]
                    [ -- Header
                      div [ class "flex items-center gap-3" ]
                        [ h1 [ class "text-7xl font-bold text-white font-quicksand" ] [ text "Hey Folks" ]
                        , span [ class "text-4xl" ] [ text "👋" ]
                        ]

                    -- Description
                    , p [ class "text-2xl text-gray-300 leading-relaxed max-w-lg font-quicksand font-medium" ]
                        [ text "I'm Feriel. I enjoy transforming complex ideas into simple, accessible products that anyone can use." ]

                    -- CLI Terminal
                    , div [ class "cli-terminal rounded-xl max-w-xl overflow-hidden" ]
                        [ -- Terminal header
                          div [ class "cli-terminal-header px-4 py-3 flex items-center justify-between" ]
                            [ div [ class "text-xs text-gray-400 font-quicksand font-medium" ] [ text "" ]
                            , div [ class "flex items-center gap-2" ]
                                [ div [ class "w-3 h-3 rounded-full shadow-lg", style "background-color" "#B882B8" ] []
                                , div [ class "w-3 h-3 rounded-full shadow-lg", style "background-color" "#F6C17B" ] []
                                , div [ class "w-3 h-3 rounded-full shadow-lg", style "background-color" "#AEC68B" ] []
                                ]
                            ]

                        -- Terminal content with scrollable area
                        , div [ class "cli-content max-h-64 overflow-y-auto p-6" ]
                            [ div [ class "font-firacode text-sm space-y-3", id "terminal-content" ]
                                [ div [ class "flex items-center" ]
                                    [ span [ class "cli-prompt mr-2" ] [ text "❯" ]
                                    , span [ class "text-gray-300" ] [ text "cat welcome.txt" ]
                                    ]
                                , div [ class "cli-output pl-4 mb-2" ] [ text "Welcome to my digital workspace! 🚀" ]
                                , div [ class "cli-output pl-4 mb-4 text-gray-400" ] [ text "Type 'help' to see available commands" ]

                                -- Interactive prompt
                                , div [ class "flex items-center", id "terminal-prompt" ]
                                    [ span [ class "cli-prompt mr-2" ] [ text "❯" ]
                                    , span [ class "text-gray-500 font-quicksand", id "terminal-input-placeholder" ] [ text "Type a command..." ]
                                    , span [ class "terminal-cursor inline-block w-2 h-4 ml-1" ] []
                                    ]
                                ]
                            ]
                        ]
                    ]

                -- Right side image
                , div [ class "flex justify-end items-end relative h-full min-h-96" ]
                    [ img
                        [ src "img/cat-workshop.png"
                        , alt "Cute cats working together in a workshop"
                        , class "max-w-full h-auto drop-shadow-2xl transform translate-x-8 translate-y-12"
                        ]
                        []
                    ]
                ]
            ]

        -- Bottom folder icons
        {- , div [ class "p-6" ]
           [ div [ class "flex justify-end gap-6" ]
               [ folderIcon "img/hobbies.png" "Hobbies"
               , folderIcon "img/projects.png" "Projects"
               , folderIcon "img/books.png" "Books"
               , folderIcon "img/research.png" "Research"
               ]
           ]
        -}
        ]



-- folderIcon : String -> String -> Html Msg
-- folderIcon imageSrc label =
--     div [ class "flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" ]
--         [ img
--             [ src imageSrc
--             , alt label
--             , class "w-14 h-14 drop-shadow-lg"
--             ]
--             []
--         , span [ class "text-xs text-gray-400 font-quicksand font-medium" ] [ text label ]
--         ]
-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
