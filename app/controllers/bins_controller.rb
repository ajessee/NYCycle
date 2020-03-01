class BinsController < ApplicationController

  def index
    @bins = Bin.all
    render "/bins/index"
  end

end
