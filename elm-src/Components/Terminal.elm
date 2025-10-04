module Components.Terminal exposing (viewCLIButton, viewTerminal, viewTerminalModal)

import Html exposing (Html, div, img, span, text)
import Html.Attributes exposing (class, id, src, style)



-- TERMINAL COMPONENT


viewTerminal : String -> String -> String -> Html msg
viewTerminal contentId promptId placeholderId =
    div [ class "cli-terminal rounded-xl max-w-xl overflow-hidden" ]
        [ viewTerminalHeader
        , viewTerminalContent contentId promptId placeholderId
        ]


viewTerminalModal : Html msg
viewTerminalModal =
    div
        [ id "cli-modal"
        , class "hidden fixed inset-0 flex items-center justify-center z-50"
        , style "backdrop-filter" "blur(8px)"
        , style "background-color" "rgba(0, 0, 0, 0.3)"
        ]
        [ div [ class "cli-terminal rounded-xl shadow-2xl max-w-3xl w-full mx-4" ]
            [ viewTerminalHeaderWithClose
            , viewTerminalContent "terminal-content-modal" "terminal-prompt-modal" "terminal-input-placeholder-modal"
            ]
        ]



-- SHARED TERMINAL HEADER (no close button)


viewTerminalHeader : Html msg
viewTerminalHeader =
    div [ class "cli-terminal-header px-4 py-3 flex items-center justify-between" ]
        [ div [ class "text-xs text-gray-400 font-quicksand font-medium" ] [ text "feriel@terminal" ]
        , div [ class "flex items-center gap-2" ]
            [ div [ class "w-3 h-3 rounded-full shadow-lg", style "background-color" "#A4D4FD" ] []
            , div [ class "w-3 h-3 rounded-full shadow-lg", style "background-color" "#F6C17B" ] []
            , div [ class "w-3 h-3 rounded-full shadow-lg", style "background-color" "#B882B8" ] []
            ]
        ]



-- TERMINAL HEADER WITH CLOSE BUTTON (for modal)


viewTerminalHeaderWithClose : Html msg
viewTerminalHeaderWithClose =
    div [ class "cli-terminal-header px-4 py-3 flex items-center justify-between rounded-t-xl" ]
        [ div [ class "text-xs text-gray-400 font-quicksand font-medium" ] [ text "feriel@terminal" ]
        , div [ class "flex items-center gap-2" ]
            [ div [ class "w-3 h-3 rounded-full shadow-lg", style "background-color" "#A4D4FD" ] []
            , div [ class "w-3 h-3 rounded-full shadow-lg", style "background-color" "#F6C17B" ] []
            , div [ id "cli-close-button", class "w-3 h-3 rounded-full shadow-lg cursor-pointer hover:brightness-110 transition-all", style "background-color" "#B882B8" ] []
            ]
        ]



-- SHARED TERMINAL CONTENT


viewTerminalContent : String -> String -> String -> Html msg
viewTerminalContent contentId promptId placeholderId =
    div [ class "cli-content max-h-64 overflow-y-auto p-6" ]
        [ div [ class "font-firacode text-sm space-y-3", id contentId ]
            [ div [ class "flex items-center" ]
                [ span [ class "cli-prompt mr-2" ] [ text "❯" ]
                , span [ class "text-gray-300" ] [ text "cat welcome.txt" ]
                ]
            , div [ class "cli-output pl-4 mb-2" ] [ text "Welcome to my digital workspace! 🚀" ]
            , div [ class "cli-output pl-4 mb-4 text-gray-400" ] [ text "Type 'help' to see available commands" ]
            , div [ class "flex items-center", id promptId ]
                [ span [ class "cli-prompt mr-2" ] [ text "❯" ]
                , span [ class "text-gray-500 font-quicksand", id placeholderId ] [ text "Type a command..." ]
                , span [ class "terminal-cursor inline-block w-2 h-4 ml-1" ] []
                ]
            ]
        ]



-- CLI TOGGLE BUTTON (for content pages)


viewCLIButton : Html msg
viewCLIButton =
    div
        [ id "cli-toggle-button"
        , class "fixed bottom-8 left-8 cursor-pointer transition-all duration-300 hover:scale-110 z-40"
        ]
        [ img
            [ src "img/CLI.png"
            , class "w-16 h-16 drop-shadow-2xl"
            ]
            []
        ]
