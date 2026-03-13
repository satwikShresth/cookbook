import { useState } from 'react'
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Box, Flex } from '@chakra-ui/react'
import { Sidebar, SidebarContent } from '#/components/Sidebar'
import { ColorModeButton } from '#/components/ui/color-mode'
import { LuMenu, LuX } from 'react-icons/lu'
import { Link } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
})

function MobileTopBar({ onOpen }: { onOpen: () => void }) {
  return (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      position="sticky"
      top={0}
      zIndex={50}
      h="14"
      px="4"
      align="center"
      justify="space-between"
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg"
    >
      <button
        onClick={onOpen}
        aria-label="Open menu"
        style={{ display: 'flex', alignItems: 'center', padding: '6px', borderRadius: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
      >
        <LuMenu size={20} />
      </button>
      <Link to="/">
        <Box fontSize="sm" fontWeight="700" letterSpacing="-0.02em">מַטְבָּח יַנְקֶלֶע</Box>
      </Link>
      <ColorModeButton size="sm" variant="ghost" />
    </Flex>
  )
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const routerState = useRouterState()
  const currentSlug = routerState.location.pathname.replace(/^\//, '')

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        inset={0}
        zIndex={60}
        bg="blackAlpha.600"
        onClick={onClose}
        display={{ base: 'block', md: 'none' }}
      />
      {/* Drawer panel */}
      <Box
        position="fixed"
        top={0}
        left={0}
        bottom={0}
        zIndex={70}
        w="280px"
        bg="bg"
        borderRightWidth="1px"
        borderColor="border"
        display={{ base: 'flex', md: 'none' }}
        flexDirection="column"
        overflow="hidden"
      >
        <Flex px="4" pt="5" pb="3" align="center" justify="space-between" flexShrink={0}>
          <Link to="/" onClick={onClose}>
            <Box fontWeight="700" fontSize="md" letterSpacing="-0.02em" lineHeight="1.2">
              מַטְבָּח יַנְקֶלֶע
            </Box>
            <Box fontSize="xs" color="fg.muted" mt="0.5">Yankele's Kitchen</Box>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{ display: 'flex', alignItems: 'center', padding: '6px', borderRadius: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7 }}
          >
            <LuX size={18} />
          </button>
        </Flex>
        <Box flex="1" overflow="hidden">
          <SidebarContent currentSlug={currentSlug} onNavigate={onClose} />
        </Box>
      </Box>
    </>
  )
}

function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Flex w="100%" minH="100vh" direction="column">
      {/* Mobile top bar */}
      <MobileTopBar onOpen={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Desktop + content row */}
      <Flex flex="1" align="flex-start">
        {/* Left sidebar — desktop only */}
        <Box
          display={{ base: 'none', md: 'block' }}
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

        {/* Main content */}
        <Box flex="1" minW={0} display="flex" justifyContent="center">
          <Box w="100%" maxW="900px" py={{ base: '6', md: '12' }} px={{ base: '4', md: '10' }}>
            <Outlet />
          </Box>
        </Box>
      </Flex>

      <TanStackRouterDevtools position="bottom-right" />
    </Flex>
  )
}
