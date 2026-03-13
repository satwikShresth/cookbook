import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from '#/components/Sidebar'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <Flex w="100%" minH="100vh">
      {/* Left sidebar */}
      <Box
        w="260px"
        flexShrink={0}
        position="sticky"
        top={0}
        h="100vh"
        alignSelf="flex-start"
        borderRightWidth="1px"
        borderColor="border"
      >
        <Sidebar />
      </Box>

      {/* Main content — centered with max-width */}
      <Box flex="1" minW={0} display="flex" justifyContent="center">
        <Box w="100%" maxW="900px" py="12" px="10">
          <Outlet />
        </Box>
      </Box>

      <TanStackRouterDevtools position="bottom-right" />
    </Flex>
  )
}
