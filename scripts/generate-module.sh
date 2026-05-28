#!/bin/bash
set -e

MODULE=$1
if [ -z "$MODULE" ]; then
  echo "Usage: bash scripts/generate-module.sh <module-name>"
  echo "Example: bash scripts/generate-module.sh playlist"
  exit 1
fi

MODULE_LOWER=$(echo "$MODULE" | tr '[:upper:]' '[:lower:]')
MODULE_UPPER=$(echo "${MODULE:0:1}" | tr '[:lower:]' '[:upper:]')${MODULE:1}
BASE_DIR="packages/server/src/modules/$MODULE_LOWER"

echo "🏗️  Generating module: $MODULE_UPPER"

mkdir -p "$BASE_DIR/entities" "$BASE_DIR/dto" "$BASE_DIR/guards"

# Entity
cat > "$BASE_DIR/entities/$MODULE_LOWER.entity.ts" << EOF
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('${MODULE_LOWER}s')
export class ${MODULE_UPPER} {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
EOF

# DTO
cat > "$BASE_DIR/dto/create-${MODULE_LOWER}.dto.ts" << EOF
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Create${MODULE_UPPER}Dto {
  @ApiProperty({ description: '名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
EOF

cat > "$BASE_DIR/dto/update-${MODULE_LOWER}.dto.ts" << EOF
import { PartialType } from '@nestjs/swagger';
import { Create${MODULE_UPPER}Dto } from './create-${MODULE_LOWER}.dto';

export class Update${MODULE_UPPER}Dto extends PartialType(Create${MODULE_UPPER}Dto) {}
EOF

# Service
cat > "$BASE_DIR/$MODULE_LOWER.service.ts" << EOF
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${MODULE_UPPER} } from './entities/$MODULE_LOWER.entity';
import { Create${MODULE_UPPER}Dto } from './dto/create-${MODULE_LOWER}.dto';
import { Update${MODULE_UPPER}Dto } from './dto/update-${MODULE_LOWER}.dto';

@Injectable()
export class ${MODULE_UPPER}sService {
  constructor(
    @InjectRepository(${MODULE_UPPER})
    private repo: Repository<${MODULE_UPPER}>,
  ) {}

  async create(dto: Create${MODULE_UPPER}Dto) {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(params: { page?: number; pageSize?: number } = {}) {
    const { page = 1, pageSize = 20 } = params;
    const [list, total] = await this.repo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { sortOrder: 'ASC', id: 'DESC' },
    });
    return { list, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('${MODULE_UPPER}不存在');
    return item;
  }

  async update(id: number, dto: Update${MODULE_UPPER}Dto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
  }
}
EOF

# Controller
cat > "$BASE_DIR/$MODULE_LOWER.controller.ts" << EOF
import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ${MODULE_UPPER}sService } from './$MODULE_LOWER.service';
import { Create${MODULE_UPPER}Dto } from './dto/create-${MODULE_LOWER}.dto';
import { Update${MODULE_UPPER}Dto } from './dto/update-${MODULE_LOWER}.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('${MODULE_UPPER}s')
@Controller('${MODULE_LOWER}s')
export class ${MODULE_UPPER}sController {
  constructor(private readonly service: ${MODULE_UPPER}sService) {}

  @Post()
  @ApiOperation({ summary: '创建${MODULE_UPPER}' })
  create(@Body() dto: Create${MODULE_UPPER}Dto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '获取${MODULE_UPPER}列表' })
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    return this.service.findAll({ page, pageSize });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取${MODULE_UPPER}详情' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新${MODULE_UPPER}' })
  update(@Param('id') id: number, @Body() dto: Update${MODULE_UPPER}Dto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除${MODULE_UPPER}' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
EOF

# Module
cat > "$BASE_DIR/$MODULE_LOWER.module.ts" << EOF
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${MODULE_UPPER} } from './entities/$MODULE_LOWER.entity';
import { ${MODULE_UPPER}sService } from './$MODULE_LOWER.service';
import { ${MODULE_UPPER}sController } from './$MODULE_LOWER.controller';

@Module({
  imports: [TypeOrmModule.forFeature([${MODULE_UPPER}])],
  providers: [${MODULE_UPPER}sService],
  controllers: [${MODULE_UPPER}sController],
  exports: [${MODULE_UPPER}sService],
})
export class ${MODULE_UPPER}sModule {}
EOF

echo "✅ Module '$MODULE_UPPER' generated successfully!"
echo "📁 Files created in: $BASE_DIR/"
ls -la "$BASE_DIR/"
