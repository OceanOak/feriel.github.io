module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Components.Terminal
import Html exposing (Html, a, div, h1, img, p, span, text)
import Html.Attributes exposing (alt, class, href, id, src, style)
import Pages.Hobbies
import Pages.Projects
import Pages.Reading
import Pages.Research
import Url
import Url.Parser as Parser exposing (Parser, oneOf, s)



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }



-- MODEL


type alias Model =
    { key : Nav.Key
    , route : Route
    }


type Route
    = Home
    | Reading
    | Hobbies
    | Projects
    | Research
    | NotFound


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    ( { key = key
      , route = parseUrl url
      }
    , Cmd.none
    )



-- ROUTING


routeParser : Parser (Route -> a) a
routeParser =
    oneOf
        [ Parser.map Home Parser.top
        , Parser.map Reading (s "reading")
        , Parser.map Hobbies (s "hobbies")
        , Parser.map Projects (s "projects")
        , Parser.map Research (s "research")
        ]


parseUrl : Url.Url -> Route
parseUrl url =
    Parser.parse routeParser url
        |> Maybe.withDefault NotFound



-- UPDATE


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            ( { model | route = parseUrl url }, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = getPageTitle model.route
    , body = [ viewPage model.route ]
    }


getPageTitle : Route -> String
getPageTitle route =
    case route of
        Home ->
            "Feriel's Website"

        Reading ->
            "Reading"

        Hobbies ->
            "Hobbies"

        Projects ->
            "Projects"

        Research ->
            "Research"

        NotFound ->
            "Not Found"


viewPage : Route -> Html Msg
viewPage route =
    case route of
        Home ->
            viewHome

        Reading ->
            Pages.Reading.view

        Hobbies ->
            Pages.Hobbies.view

        Projects ->
            Pages.Projects.view

        Research ->
            Pages.Research.view

        NotFound ->
            viewNotFound



-- HOME PAGE


viewHome : Html Msg
viewHome =
    div [ class "min-h-screen text-white flex flex-col relative overflow-hidden font-quicksand", style "background-color" "#1E1E1E" ]
        [ viewStar
        , viewMainContent
        , viewFolderIcons
        ]


viewStar : Html Msg
viewStar =
    img
        [ src "img/star.png"
        , alt "Star"
        , class "absolute top-8 right-8 w-8 h-8 opacity-80"
        ]
        []


viewMainContent : Html Msg
viewMainContent =
    div [ class "flex-1 flex items-center justify-center py-8" ]
        [ div [ class "max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" ]
            [ viewLeftContent
            , viewCatImage
            ]
        ]


viewLeftContent : Html Msg
viewLeftContent =
    div [ class "space-y-8" ]
        [ viewHeader
        , viewDescription
        , viewTerminal
        ]


viewHeader : Html Msg
viewHeader =
    div [ class "flex items-center gap-3" ]
        [ h1 [ class "text-7xl font-bold text-white font-quicksand" ] [ text "Hey Folks" ]
        , span [ class "text-4xl" ] [ text "👋" ]
        ]


viewDescription : Html Msg
viewDescription =
    p [ class "text-2xl text-gray-300 leading-relaxed max-w-lg font-quicksand font-medium" ]
        [ text "I'm Feriel. I enjoy transforming complex ideas into simple, accessible products that anyone can use" ]


viewTerminal : Html Msg
viewTerminal =
    Components.Terminal.viewTerminal "terminal-content" "terminal-prompt" "terminal-input-placeholder"


viewCatImage : Html Msg
viewCatImage =
    div [ class "flex justify-end items-end relative h-full min-h-96" ]
        [ img
            [ src "img/cat-workshop.png"
            , alt "Cute cats working together in a workshop"
            , class "max-w-full h-auto drop-shadow-2xl transform translate-x-8 translate-y-12"
            ]
            []
        ]


viewFolderIcons : Html Msg
viewFolderIcons =
    div [ class "p-6" ]
        [ div [ class "flex justify-center gap-6" ]
            [ folderIcon "/projects" "img/Projects.png" "Projects"
            , folderIcon "/reading" "img/Reading.png" "Reading"
            , folderIcon "/research" "img/Research.png" "Research"
            , folderIcon "/hobbies" "img/Hobbies.png" "Hobbies"
            ]
        ]


folderIcon : String -> String -> String -> Html Msg
folderIcon link imageSrc label =
    a [ href link, class "flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 no-underline" ]
        [ img
            [ src imageSrc
            , alt label
            , class "w-18 h-14 drop-shadow-lg"
            ]
            []
        , span [ class "text-xs text-gray-400 font-quicksand font-medium" ] [ text label ]
        ]



-- NOT FOUND PAGE


viewNotFound : Html Msg
viewNotFound =
    div [ class "min-h-screen flex items-center justify-center font-quicksand", style "background-color" "#1E1E1E" ]
        [ div [ class "text-center text-white" ]
            [ h1 [ class "text-6xl font-bold mb-4" ] [ text "404" ]
            , p [ class "text-xl text-gray-300 mb-8" ] [ text "Page not found" ]
            , a [ href "/", class "text-purple-300 hover:text-purple-200 transition-colors text-lg" ]
                [ text "← Back to Home" ]
            ]
        ]
