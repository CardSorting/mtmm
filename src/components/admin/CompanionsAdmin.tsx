import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  Companion,
  CompanionFormData,
  Tag,
  TagCategory,
} from "../../types/companions";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "../../components/ui/use-toast";

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
    companion_link: "",
    theme: "professional",
    featured: false,
    tags: [],
  });
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchCategories = async () => {
    try {
      const categoriesQuery = query(
        collection(db, "tag_categories"),
        orderBy("name")
      );
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categoriesData = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TagCategory[];
      
      setCategories(categoriesData);
      if (categoriesData.length > 0) setSelectedCategory(categoriesData[0].id);
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
      const tagsQuery = query(collection(db, "tags"), orderBy("name"));
      const tagsSnapshot = await getDocs(tagsQuery);
      const tagsData = await Promise.all(
        tagsSnapshot.docs.map(async (doc) => {
          const tagData = doc.data();
          const categoryDoc = await getDocs(
            query(
              collection(db, "tag_categories"),
              where("id", "==", tagData.category_id)
            )
          );
          return {
            id: doc.id,
            ...tagData,
            category: categoryDoc.docs[0]?.data() || null,
          };
        })
      ) as Tag[];
      
      setTags(tagsData);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tags",
        variant: "destructive",
      });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "tag_categories"), {
        name: newCategory.trim(),
        created_at: new Date().toISOString(),
      });

      const newCategoryData = {
        id: docRef.id,
        name: newCategory.trim(),
        created_at: new Date().toISOString(),
      };

      setCategories([...categories, newCategoryData]);
      setNewCategory("");
      setSelectedCategory(docRef.id);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const fetchCompanions = async () => {
    try {
      const companionsQuery = query(
        collection(db, "companions"),
        orderBy("created_at", "desc")
      );
      const companionsSnapshot = await getDocs(companionsQuery);
      const companionsData = await Promise.all(
        companionsSnapshot.docs.map(async (doc) => {
          const companionData = doc.data();
          const companionTagsQuery = query(
            collection(db, "companions_tags"),
            where("companion_id", "==", doc.id)
          );
          const companionTagsSnapshot = await getDocs(companionTagsQuery);
          const tagIds = companionTagsSnapshot.docs.map((tagDoc) => tagDoc.data().tag_id);
          const tagsQuery = query(
            collection(db, "tags"),
            where("id", "in", tagIds)
          );
          const tagsSnapshot = await getDocs(tagsQuery);
          const tags = await Promise.all(
            tagsSnapshot.docs.map(async (tagDoc) => {
              const tagData = tagDoc.data();
              const categoryQuery = query(
                collection(db, "tag_categories"),
                where("id", "==", tagData.category_id)
              );
              const categorySnapshot = await getDocs(categoryQuery);
              
              return {
                id: tagDoc.id,
                ...tagData,
                category: categorySnapshot.docs[0]?.data() || null,
              };
            })
          );

          return {
            id: doc.id,
            ...companionData,
            tags,
          } as Companion;
        })
      );

      setCompanions(companionsData);
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
      const docRef = await addDoc(collection(db, "tags"), {
        name: newTag.trim(),
        category_id: selectedCategory,
        created_at: new Date().toISOString(),
      });

      const categoryQuery = query(
        collection(db, "tag_categories"),
        where("id", "==", selectedCategory)
      );
      const categorySnapshot = await getDocs(categoryQuery);
      const newTagData = {
        id: docRef.id,
        name: newTag.trim(),
        category_id: selectedCategory,
        created_at: new Date().toISOString(),
        category: categorySnapshot.docs[0]?.data() || null,
      } as Tag;

      setTags([...tags, newTagData]);
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
        await updateDoc(doc(db, "companions", editingCompanion.id), {
          name: formData.name,
          avatar: formData.avatar,
          description: formData.description,
          companion_link: formData.companion_link,
          theme: formData.theme,
          featured: formData.featured,
          updated_at: new Date().toISOString(),
        });

        // Update tags
        const batch = writeBatch(db);
        const companionTagsQuery = query(
          collection(db, "companions_tags"),
          where("companion_id", "==", editingCompanion.id)
        );
        const companionTagsSnapshot = await getDocs(companionTagsQuery);

        companionTagsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        if (formData.tags && formData.tags.length > 0) {
          formData.tags.forEach((tagId) => {
            const newTagRef = doc(collection(db, "companions_tags"));
            batch.set(newTagRef, {
              companion_id: editingCompanion.id,
              tag_id: tagId,
            });
          });
        }

        await batch.commit();

        toast({
          title: "Success",
          description: "Companion updated successfully",
        });
      } else {
        // Create new companion
        const companionRef = await addDoc(collection(db, "companions"), {
          name: formData.name,
          avatar: formData.avatar,
          description: formData.description,
          companion_link: formData.companion_link,
          theme: formData.theme,
          featured: formData.featured,
          rating: 0,
          conversations: 0,
          likes_count: 0,
          dislikes_count: 0,
          stars_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        // Add tags
        if (formData.tags && formData.tags.length > 0) {
          const batch = writeBatch(db);
          formData.tags.forEach((tagId) => {
            const newTagRef = doc(collection(db, "companions_tags"));
            batch.set(newTagRef, {
              companion_id: companionRef.id,
              tag_id: tagId,
            });
          });
          await batch.commit();
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
        companion_link: "",
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
      companion_link: companion.companion_link,
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
      await deleteDoc(doc(db, "companions", id));
      
      // Delete associated tags
      const batch = writeBatch(db);
      const companionTagsQuery = query(
        collection(db, "companions_tags"),
        where("companion_id", "==", id)
      );
      const companionTagsSnapshot = await getDocs(companionTagsQuery);

      companionTagsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();

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
                  companion_link: "",
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
                <Label htmlFor="companion_link">Companion Link</Label>
                <Input
                  id="companion_link"
                  value={formData.companion_link}
                  onChange={(e) =>
                    setFormData({ ...formData, companion_link: e.target.value })
                  }
                  placeholder="https://example.com/chat/companion-id"
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
                <div className="flex justify-between items-center">
                  <Label>Tag Categories</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="New category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-[200px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateCategory();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleCreateCategory}
                      size="sm"
                      variant="outline"
                    >
                      Add Category
                    </Button>
                  </div>
                </div>
                <div className="space-y-6">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or create a category" />
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
                    {companion.likes_count}
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
