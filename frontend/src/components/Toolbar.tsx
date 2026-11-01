import React from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from "@chakra-ui/react";
import { FiChevronDown, FiSearch, FiTrash2 } from "react-icons/fi";
import { MotionBox } from "../utils/motion";
import { Filter, SORT_LABELS, SortKey } from "../utils/todos";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Done" },
];

type Props = {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  search: string;
  onSearchChange: (s: string) => void;
  counts: Record<Filter, number>;
  onClearCompleted: () => void;
  searchRef?: React.Ref<HTMLInputElement>;
};

const Toolbar: React.FC<Props> = ({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
  counts,
  onClearCompleted,
  searchRef,
}) => (
  <Box>
    <InputGroup>
      <InputLeftElement pointerEvents="none" color="app.muted">
        <FiSearch />
      </InputLeftElement>
      <Input
        ref={searchRef}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks"
        aria-label="Search tasks"
        bg="app.surface"
        borderColor="app.border"
        rounded="full"
        _focusVisible={{ borderColor: "app.accent", boxShadow: "0 0 0 1px var(--chakra-colors-app-accent)" }}
      />
    </InputGroup>

    <Flex mt={3} align="center" justify="space-between" gap={2} wrap="wrap">
      <Flex
        bg="app.surface"
        borderWidth="1px"
        borderColor="app.border"
        rounded="full"
        p="3px"
        role="group"
        aria-label="Filter tasks"
      >
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <Box
              as="button"
              type="button"
              key={key}
              aria-pressed={active}
              onClick={() => onFilterChange(key)}
              pos="relative"
              px={4}
              py={1.5}
              rounded="full"
              fontSize="sm"
              fontWeight="semibold"
              color={active ? "app.accentText" : "app.muted"}
              transition="color .2s"
            >
              {active && (
                <MotionBox
                  layoutId="filter-pill"
                  pos="absolute"
                  inset={0}
                  rounded="full"
                  bg="app.accent"
                  zIndex={0}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Box as="span" pos="relative" zIndex={1}>
                {label}{" "}
                <Text as="span" opacity={0.65}>
                  {counts[key]}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Flex>

      <Flex gap={1} align="center">
        {counts.completed > 0 && (
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<FiTrash2 />}
            colorScheme="red"
            onClick={onClearCompleted}
          >
            Clear done
          </Button>
        )}
        <Menu>
          <MenuButton as={Button} size="sm" variant="ghost" rightIcon={<FiChevronDown />}>
            {SORT_LABELS[sort]}
          </MenuButton>
          <MenuList bg="app.surface" borderColor="app.border" minW="160px">
            <MenuOptionGroup
              type="radio"
              value={sort}
              onChange={(v) => onSortChange(v as SortKey)}
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <MenuItemOption key={key} value={key} bg="transparent">
                  {SORT_LABELS[key]}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  </Box>
);

export default Toolbar;
