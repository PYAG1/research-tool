import * as React from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pin, PinOff, SettingsIcon, Trash } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from './context-menu'

import { queryKey, STORAGE_KEYS } from '@renderer/constants'
import { useAuth } from '@renderer/context/auth'
import { useConfirmation } from '@renderer/context/confirmation'
import CreateCategoryModal from '@renderer/features/categories/create-category-modal'
import { DeleteCategoryMutation, GetAllCategories } from '@renderer/services/category'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from './sidebar'
import { Skeleton } from './skeleton'
import { VersionSwitcher } from './version-switcher'

const navigationItems = {
  navSecondary: [
    {
      title: 'Settings',
      url: '/app/settings',
      icon: SettingsIcon
    },
    {
      title: 'Trash',
      url: '/app/trash',
      icon: Trash
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { showConfirmation } = useConfirmation()
  const queryClient = useQueryClient()
  const [pinnedCategories, setPinnedCategories] = React.useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PINNED_CATEGORIES)
    return stored ? JSON.parse(stored) : []
  })

  const { mutateAsync: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: DeleteCategoryMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.categories] })
    }
  })

  function togglePinCategory(categoryId: string) {
    const isPinned = pinnedCategories.includes(categoryId)

    // Update state with new pinned categories
    const newPinned = isPinned
      ? pinnedCategories.filter((id) => id !== categoryId) // Remove if pinned
      : [...pinnedCategories, categoryId] // Add if not pinned

    // Update state
    setPinnedCategories(newPinned)

    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.PINNED_CATEGORIES, JSON.stringify(newPinned))

    toast.success(isPinned ? 'Category unpinned' : 'Category pinned')
  }

  async function handleDeleteCategory(categoryId: string, categoryName: string) {
    showConfirmation({
      title: 'Delete Category',
      variant: 'destructive',
      btnTitle: 'yes, delete',
      isLoading: isDeleting,
      description: `Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`,
      onConfirm: () => {
        toast.promise(deleteCategory({ id: categoryId }), {
          loading: 'Deleting category...',
          success: 'Category deleted successfully',
          error: (error) => {
            console.error('Failed to delete category', error)
            return 'Failed to delete category'
          }
        })

        return true
      }
    })
  }

  const getUserInitials = (email?: string) => {
    if (!email) return '?'
    const namePart = email.split('@')[0]
    if (namePart) {
      return namePart.charAt(0).toUpperCase()
    }
    return '?'
  }

  const { data, isLoading } = useQuery({
    queryKey: [queryKey.categories],
    queryFn: () =>
      GetAllCategories({
        page: 0,
        pageSize: 10
      })
  })

  const navigate = useNavigate()

  // const { id } = useParams();
  const id = '1'
  const pathname = useLocation().pathname

  const categories = React.useMemo(() => {
    const items =
      data?.data?.map((item) => ({
        ...item,
        documentcount: item.research_papers?.length ?? 0,
        isPinned: pinnedCategories.includes(item.id)
      })) ?? []

    // Sort: pinned first, then by name
    return items.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return a.name.localeCompare(b.name)
    })
  }, [data?.data, pinnedCategories])

  const userData = {
    name: user?.user_metadata?.full_name ?? 'User',
    email: user?.email ?? '',
    avatar: getUserInitials(user?.email) || ''
  }

  if (isLoading) {
    return (
      <Sidebar {...props}>
        <SidebarHeader>
          <VersionSwitcher
            versions={['1.0.1', '1.1.0-alpha', '2.0.0-beta1']}
            defaultVersion={'1.0.1'}
          />
        </SidebarHeader>
        <SidebarContent className="max-h-3/5 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel>My Library</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Skeleton className="h-8 w-full rounded-md" />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Skeleton className="h-8 w-full rounded-md" />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Skeleton className="h-8 w-full rounded-md" />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="flex flex-col gap-2 px-3">
          <CreateCategoryModal />
        </div>
        <SidebarRail />
        <NavSecondary items={navigationItems.navSecondary} className="mt-auto" />
        <div className="ml-2 flex items-center gap-2 py-4">
          {user && <NavUser user={userData} />}
        </div>
      </Sidebar>
    )
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={['1.0.1', '1.1.0-alpha', '2.0.0-beta1']}
          defaultVersion={'1.0.1'}
        />
      </SidebarHeader>
      <SidebarContent className="max-h-3/5 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel>My Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories?.map((item) => {
                const isActive = item.id === id
                const isPinned = pinnedCategories.includes(item.id)

                return (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          onClick={() => navigate({ to:"/category/$id",params:{id:item?.id}})} //home/${item.id}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2 py-1.5">
                            <span
                              className="w-3 h-3 rounded-full inline-block"
                              style={{ background: item.color }}
                            />
                            <span className="flex-1">{item.name}</span>
                            {isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
                            <span className="text-neutral-600 dark:text-gray-400 text-sm">
                              {item.documentcount ?? 0}
                            </span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                      <ContextMenuItem onClick={() => togglePinCategory(item.id)}>
                        {isPinned ? (
                          <>
                            <PinOff className="mr-2 h-4 w-4" />
                            Unpin Category
                          </>
                        ) : (
                          <>
                            <Pin className="mr-2 h-4 w-4" />
                            Pin Category
                          </>
                        )}
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onClick={() => handleDeleteCategory(item.id, item.name)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Category
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                )
              })}
              <SidebarMenuItem key="view_all">
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/categories'}
                  onClick={() => navigate({ to: "/categories" })}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 py-1.5 my-2">
                    <span className="flex-1">View All</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Unsorted papers always at the bottom */}
              <SidebarMenuItem key="unsorted">
                <SidebarMenuButton
                  asChild
                  isActive={!id}
                  onClick={() => navigate({ to: '/about' })} //unsorted
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 py-1.5">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ background: '#B0B0B0' }}
                    />
                    <span className="flex-1">Unsorted papers</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="flex flex-col gap-2 px-3">
        <CreateCategoryModal />
      </div>
      <SidebarRail />
      <NavSecondary items={navigationItems.navSecondary} className="mt-auto" />
      <div className="ml-2 flex items-center gap-2 py-4">{user && <NavUser user={userData} />}</div>
    </Sidebar>
  )
}
