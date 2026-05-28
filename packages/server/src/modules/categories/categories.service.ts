import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Check slug uniqueness
    if (createCategoryDto.slug) {
      const existing = await this.categoryRepository.findOne({
        where: { slug: createCategoryDto.slug },
      });
      if (existing) {
        throw new ConflictException('分类别名已存在');
      }
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return categories;
  }

  async findTree() {
    const categories = await this.findAll();
    return this.buildTree(categories);
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: Partial<CreateCategoryDto>) {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    // Check if has children
    const children = await this.categoryRepository.find({
      where: { parentId: id },
    });
    if (children.length > 0) {
      throw new ConflictException('该分类下有子分类，不能删除');
    }
    await this.categoryRepository.remove(category);
    return { message: '删除成功' };
  }

  private buildTree(categories: Category[], parentId = 0): any[] {
    return categories
      .filter((c) => c.parentId === parentId)
      .map((c) => ({
        ...c,
        children: this.buildTree(categories, c.id),
      }));
  }

  async count() {
    return this.categoryRepository.count();
  }
}
