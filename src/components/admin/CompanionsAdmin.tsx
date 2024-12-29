import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Companion,
  CompanionFormData,
  Tag,
  TagCategory,
} from "@/types/companions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const CompanionsAdmin = () => {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompanion, setEditingCompanion] = useState<Companion | null>(
    null,
  );
  const [formData, setFormData] = useState<CompanionFormData>({
    name: "",
    avatar: "",
    description: "",
    theme: "professional",
    featured: false,
    tags: [],
  });
  const [newTag, setNewTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("tag_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0].id);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*, category:tag_categories(*)")
        .order("name");

      if (error) throw error;
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tags",
        variant: "destructive",
      });
    }
  };

  const fetchCompanions = async () => {
    try {
      const { data, error } = await supabase
        .from("companions")
        .select(
          `
          *,
          companions_tags!inner(tag_id),
          tags!inner(id, name, category_id, category:tag_categories(*))
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our Companion type
      const transformedData = data.map((companion: any) => ({
        ...companion,
        tags: companion.tags,
      }));

      setCompanions(transformedData);
    } catch (error) {
      console.error("Error fetching companions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch companions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchCompanions();
  }, []);

  const handleCreateTag = async () => {
    if (!newTag.trim() || !selectedCategory) return;

    try {
      const { data, error } = await supabase
        .from("tags")
        .insert([
          {
            name: newTag.trim(),
            category_id: selectedCategory,
          },
        ])
        .select("*, category:tag_categories(*)")
        .single();

      if (error) throw error;

      setTags([...tags, data]);
      setNewTag("");
      toast({
        title: "Success",
        description: "Tag created successfully",
      });
    } catch (error) {
      console.error("Error creating tag:", error);
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingCompanion) {
        // Update companion
        const { error: companionError } = await supabase
          .from("companions")
          .update({
            name: formData.name,
            avatar: formData.avatar,
            description: formData.description,
            theme: formData.theme,
            featured: formData.featured,
          })
          .eq("id", editingCompanion.id);

        if (companionError) throw companionError;

        // Update tags
        await supabase
          .from("companions_tags")
          .delete()
          .eq("companion_id", editingCompanion.id);

        if (formData.tags && formData.tags.length > 0) {
          const { error: tagsError } = await supabase
            .from("companions_tags")
            .insert(
              formData.tags.map((tagId) => ({
                companion_id: editingCompanion.id,
                tag_id: tagId,
              })),
            );

          if (tagsError) throw tagsError;
        }

        toast({
          title: "Success",
          description: "Companion updated successfully",
        });
      } else {
        // Create new companion
        const { data: companion, error: companionError } = await supabase
          .from("companions")
          .insert([
            {
              name: formData.name,
              avatar: formData.avatar,
              description: formData.description,
              theme: formData.theme,
              featured: formData.featured,
            },
          ])
          .select()
          .single();

        if (companionError) throw companionError;

        // Add tags
        if (formData.tags && formData.tags.length > 0) {
          const { error: tagsError } = await supabase
            .from("companions_tags")
            .insert(
              formData.tags.map((tagId) => ({
                companion_id: companion.id,
                tag_id: tagId,
              })),
            );

          if (tagsError) throw tagsError;
        }

        toast({
          title: "Success",
          description: "Companion created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingCompanion(null);
      setFormData({
        name: "",
        avatar: "",
        description: "",
        theme: "professional",
        featured: false,
        tags: [],
      });
      fetchCompanions();
    } catch (error) {
      console.error("Error saving companion:", error);
      toast({
        title: "Error",
        description: "Failed to save companion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (companion: Companion) => {
    setEditingCompanion(companion);
    setFormData({
      name: companion.name,
      avatar: companion.avatar,
      description: companion.description,
      theme: companion.theme,
      featured: companion.featured,
      tags: companion.tags?.map((tag) => tag.id) || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this companion?"))
      return;

    try {
      const { error } = await supabase.from("companions").delete().eq("id", id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Companion deleted successfully",
      });
      fetchCompanions();
    } catch (error) {
      console.error("Error deleting companion:", error);
      toast({
        title: "Error",
        description: "Failed to delete companion",
        variant: "destructive",
      });
    }
  };

  const groupedTags = tags.reduce(
    (acc, tag) => {
      const categoryId = tag.category_id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(tag);
      return acc;
    },
    {} as Record<string, Tag[]>,
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Companions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCompanion(null);
                setFormData({
                  name: "",
                  avatar: "",
                  description: "",
                  theme: "professional",
                  featured: false,
                  tags: [],
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Companion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCompanion ? "Edit" : "Add"} Companion
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, theme: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tag Categories</Label>
                <div className="space-y-6">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedCategory && (
                    <div className="space-y-4">
                      {/* Add new tag section */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="New tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleCreateTag();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={handleCreateTag}
                          size="sm"
                        >
                          Add Tag
                        </Button>
                      </div>

                      {/* Tags for selected category */}
                      <div className="grid grid-cols-2 gap-2">
                        {(groupedTags[selectedCategory] || []).map((tag) => (
                          <Button
                            key={tag.id}
                            type="button"
                            variant={
                              formData.tags?.includes(tag.id)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="justify-start"
                            onClick={() => {
                              if (formData.tags?.includes(tag.id)) {
                                setFormData({
                                  ...formData,
                                  tags: formData.tags.filter(
                                    (id) => id !== tag.id,
                                  ),
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  tags: [...(formData.tags || []), tag.id],
                                });
                              }
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{tag.name}</span>
                              {formData.tags?.includes(tag.id) && (
                                <X className="w-3 h-3 ml-2" />
                              )}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
                <Label htmlFor="featured">Featured</Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : editingCompanion
                    ? "Update Companion"
                    : "Create Companion"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companions.map((companion) => (
              <TableRow key={companion.id}>
                <TableCell>
                  <img
                    src={companion.avatar}
                    alt={companion.name}
                    className="w-10 h-10 rounded-full"
                  />
                </TableCell>
                <TableCell>{companion.name}</TableCell>
                <TableCell className="capitalize">{companion.theme}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {companion.tags?.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{companion.featured ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    ⭐️ {companion.rating} · 💬 {companion.conversations} · ❤️{" "}
                    {companion.likes}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(companion)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(companion.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompanionsAdmin;
