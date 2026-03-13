import { useState } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Box, Flex } from '@chakra-ui/react'
import { FontSizeProvider } from '#/utils'
import { Sidebar } from '#/components/Sidebar'
import { MobileTopBar } from '#/components/MobileTopBar'
import { MobileDrawer } from '#/components/MobileDrawer'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <FontSizeProvider>
      <Flex w="100%" minH="100vh" direction="column">
        <MobileTopBar onOpen={() => setDrawerOpen(true)} />
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <Flex flex="1" align="flex-start">
          {/* Left sidebar — desktop only */}
          <Box
            display={{ base: 'none', md: 'block' }}
            w="300px"
            flexShrink={0}
            position="sticky"
            top={0}
            h="100vh"
            alignSelf="flex-start"
            borderRightWidth="1px"
            borderColor="border.muted"
          >
            <Sidebar />
          </Box>

          {/* Main content */}
          <Box flex="1" minW={0} display="flex" justifyContent="center">
            <Box w="100%" maxW="900px" py={{ base: '6', md: '12' }} px={{ base: '4', md: '10' }}>
              <Outlet />
            </Box>
          </Box>
        </Flex>

        <TanStackRouterDevtools position="bottom-right" />
      </Flex>
    </FontSizeProvider>
  )
}
