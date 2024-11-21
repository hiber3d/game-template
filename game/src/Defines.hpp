#pragma once

// TODO: Move into Hiber2 repo once solidified

#ifdef HBR_EMSCRIPTEN
#define H3D_INTEROP_SEND_TO_JS [[clang::annotate("hiber", "send_to_js")]]
#define H3D_INTEROP_RECEIVE_FROM_JS [[clang::annotate("hiber", "receive_from_js")]]
#define H3D_INTEROP_SEND_AND_RECEIVE_FROM_JS [[clang::annotate("hiber", "receive_from_js", "send_to_js")]]
#else
#define H3D_INTEROP_SEND_TO_JS
#define H3D_INTEROP_RECEIVE_FROM_JS
#define H3D_INTEROP_SEND_AND_RECEIVE_FROM_JS
#endif

#ifdef HIBER3D_TEST
#include "../test/TestUtils.hpp"
#include <gtest/gtest.h>
#endif