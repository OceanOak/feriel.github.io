module Components.Common exposing (backButton, pawIcon, pageLayout, cardSection)

import Html exposing (Html, a, div, h2, p, text)
import Html.Attributes exposing (class, href, style)
import Svg exposing (path, svg)
import Svg.Attributes as SvgAttr


backButton : Html msg
backButton =
    div [ class "mb-4 -ml-20" ]
        [ a [ href "/", class "text-purple-300 hover:text-purple-200 transition-colors text-lg" ]
            [ text "←" ]
        ]


pageLayout : String -> String -> Html msg -> List (Html msg) -> Html msg
pageLayout imageSrc altText image contentSections =
    div [ class "min-h-screen py-4 font-quicksand", style "background-color" "#1E1E1E" ]
        [ div [ class "max-w-7xl mx-auto mt-10" ]
            [ backButton
            , div [ class "grid grid-cols-1 lg:grid-cols-2 gap-10 justify-between" ]
                [ image
                , div [ class "space-y-8" ] contentSections
                ]
            ]
        ]


cardSection : String -> List String -> Html msg
cardSection heading items =
    div [ class "rounded-lg px-8 py-6 relative hover:bg-opacity-80 transition-colors cursor-pointer", style "background-color" "#171717" ]
        [ div [ class "flex items-center gap-4 mb-2" ]
            [ h2 [ class "text-2xl font-bold text-white" ] [ text heading ]
            ]
        , div [ class "space-y-3 ml-4" ]
            (List.map cardItem items)
        , div [ class "absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 text-4xl" ]
            [ text "›" ]
        ]


cardItem : String -> Html msg
cardItem item =
    div [ class "flex items-start gap-3 text-gray-300 text-lg" ]
        [ div [ class "mt-1.5 flex-shrink-0" ] [ pawIcon ]
        , p [] [ text item ]
        ]


pawIcon : Html msg
pawIcon =
    svg
        [ SvgAttr.width "14"
        , SvgAttr.height "12"
        , SvgAttr.viewBox "0 0 9 8"
        , SvgAttr.fill "none"
        ]
        [ path
            [ SvgAttr.d "M4.44565 3.1111C3.85898 3.1111 3.56432 3.29821 3.14298 3.96621L3.03454 4.1431L2.85898 4.44887L2.79632 4.56176C2.68965 4.75465 2.54254 4.89643 2.2901 5.06932L2.04565 5.23154C1.62788 5.5102 1.40921 5.72843 1.28699 6.10042C1.23188 6.25065 1.19988 6.47953 1.20121 6.66931C1.20121 7.41909 1.73365 7.99997 2.44565 7.99997L2.55321 7.99731C2.6061 7.99464 2.65721 7.98975 2.71054 7.9822L2.82076 7.96308L2.87943 7.95064L3.00876 7.9182L3.08076 7.8982L3.33409 7.82264L3.6732 7.71464L3.87543 7.6542C4.11098 7.58753 4.2932 7.55553 4.44565 7.55553C4.59853 7.55553 4.78031 7.58798 5.01587 7.6542L5.21809 7.71464L5.55764 7.8222L5.81053 7.8982L5.9492 7.93553C5.99216 7.9462 6.0326 7.95538 6.07053 7.96308L6.18075 7.9822C6.23408 7.98975 6.2852 7.99464 6.33808 7.99731L6.44564 7.99997C7.15764 7.99997 7.69008 7.41909 7.69008 6.66664C7.69008 6.47687 7.65764 6.24931 7.59808 6.0862C7.49319 5.76443 7.29719 5.54265 6.9403 5.27287L6.82608 5.18843L6.59142 5.01954C6.30608 4.81065 6.14564 4.65243 6.03453 4.45154L5.91453 4.23599L5.80253 4.04399C5.3532 3.29021 5.08342 3.1111 4.44565 3.1111ZM7.90341 1.77777H7.89008C7.3483 1.78666 6.84564 2.25155 6.59764 2.89066C6.29097 3.67954 6.44297 4.54399 7.07542 4.81643C7.18919 4.86487 7.30964 4.88887 7.43141 4.88887C7.97852 4.88887 8.48919 4.42087 8.73941 3.77599C9.0443 2.98755 8.89052 2.12266 8.26119 1.85066C8.14821 1.80253 8.02622 1.77774 7.90341 1.77777ZM3.12343 0C3.07365 0 3.04121 0.000888932 3.00343 0.00666669L2.96209 0.0137777C2.28121 0.105333 1.89677 0.897775 2.02521 1.72711C2.1461 2.49377 2.67498 3.1111 3.32298 3.1111L3.40609 3.10888L3.44343 3.10443L3.48432 3.09732C4.16565 3.00577 4.54965 2.21333 4.4212 1.384C4.3012 0.616442 3.77231 0 3.12343 0Z"
            , SvgAttr.fill "#9CA3AF"
            ]
            []
        , path
            [ SvgAttr.d "M5.76604 2.65125e-05C5.1176 2.65125e-05 4.5896 0.616913 4.47005 1.38358C4.34116 2.21335 4.72516 3.00579 5.43627 3.10224C5.4816 3.10816 5.52545 3.11113 5.56782 3.11113C6.1856 3.11113 6.69804 2.54891 6.84648 1.8298L6.86471 1.72758C6.99359 0.897801 6.6096 0.105359 5.89849 0.00891536C5.85462 0.00265552 5.81035 -0.000315708 5.76604 2.65125e-05ZM0.986059 1.7778C0.864281 1.7778 0.744282 1.8018 0.631838 1.84935C-0.00193781 2.12269 -0.153493 2.98802 0.152728 3.77601C0.40295 4.4209 0.912726 4.8889 1.45984 4.8889C1.58161 4.8889 1.70161 4.8649 1.81406 4.81734C2.44783 4.54401 2.59939 3.67868 2.29317 2.89068C2.04294 2.2458 1.53317 1.7778 0.986059 1.7778Z"
            , SvgAttr.fill "#9CA3AF"
            ]
            []
        ]
